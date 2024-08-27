import { createClient } from "@/utils/supabase/server";
import RealtimeChart from "@/components/realtime-chart";

export default async function Index() {
    const supabase = createClient();

    const { data, error } = await supabase.from("chart_data").select();

    if (error) {
        console.error("Error fetching data:", error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-red-600 text-lg font-semibold">Error loading data</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col w-full items-center bg-gray-50">
            <main className="flex-1 w-full flex flex-col items-center py-10">
                <div className="max-w-4xl w-full px-6">
                    <h2 className="text-3xl p-4 font-bold text-gray-800 text-center">Real Time Chart</h2>
                    <div className="bg-white rounded-lg shadow p-6">
                        <RealtimeChart serverPrices={data} />
                    </div>
                </div>
            </main>
        </div>
    );
}
