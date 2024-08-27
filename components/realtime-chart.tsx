'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { LineChart } from '@tremor/react';

interface PriceItem {
    id: number;
    created_at: string;
    price: number;
}

interface RealtimeChartProps {
    serverPrices: PriceItem[];
}

export default function RealtimeChart({ serverPrices }: RealtimeChartProps) {
    const supabase = createClient();
    const [prices, setPrices] = useState<PriceItem[]>(serverPrices);

    useEffect(() => {
        const channel = supabase.channel("realtime chart data").on('postgres_changes', {
            event: 'INSERT', schema: 'public', table: 'chart_data'
        }, (payload) => {
            console.log(payload);
            setPrices((prevPrices: PriceItem[]) => [...prevPrices, payload.new as PriceItem]);
        }).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const chartData = prices.map((item: PriceItem, index: number) => ({
        date: formatTime(item.created_at) || `Point ${index + 1}`,
        Price: item.price,
    }));

    return (
        <LineChart
            className="h-80 w-full"
            data={chartData}
            index="date"
            categories={["Price"]}
            showAnimation={true}
            valueFormatter={(number) =>
                `$${Intl.NumberFormat("us").format(number)}`
            }
        />
    );
}
