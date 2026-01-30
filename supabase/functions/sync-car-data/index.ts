
import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log('Hello from sync-car-data!')

const NHTSA_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles'

interface NhtsaMake {
    Make_ID: number;
    Make_Name: string;
}

interface NhtsaModel {
    Model_ID: number;
    Model_Name: string;
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Apikey, x-client-info"
};

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 200,
            headers: corsHeaders
        });
    }

    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    try {
        console.log('Fetching Makes from NHTSA...')
        // NHTSA list is HUGE. Let's try "GetMakesForVehicleType/car"
        const makesRes = await fetch(`${NHTSA_BASE_URL}/GetMakesForVehicleType/car?format=json`)
        const makesData = await makesRes.json()
        const nhtsaMakes: NhtsaMake[] = makesData.Results

        // Priority list comes from the user's hardcoded preferences
        const PRIORITY_MAKES = [
            'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz',
            'Volkswagen', 'Audi', 'Mazda', 'Hyundai', 'Kia', 'Subaru', 'Jeep', 'Ram',
            'Tesla', 'Lexus', 'Acura', 'Dodge', 'GMC', 'Buick', 'Cadillac', 'Lincoln',
            'Volvo', 'Porsche', 'Mitsubishi'
        ];

        console.log('Syncing priority makes only...');

        // 1. Upsert Priority Makes
        const makesToUpsert = PRIORITY_MAKES.map(name => ({ name }));

        // We upsert just these makes to ensure they exist and we have their IDs
        const { data: insertedMakes, error: makeError } = await supabaseClient
            .from('car_makes')
            .upsert(makesToUpsert, { onConflict: 'name', ignoreDuplicates: false })
            .select();

        if (makeError) throw makeError;

        // 2. Sync Models for ONLY these makes
        let totalModels = 0;

        for (const make of insertedMakes) {
            try {
                // NHTSA API to get models for this specific make
                const modelsRes = await fetch(`${NHTSA_BASE_URL}/GetModelsForMake/${encodeURIComponent(make.name)}?format=json`);
                const modelsData = await modelsRes.json();
                const nhtsaModels: NhtsaModel[] = modelsData.Results;

                if (!nhtsaModels || nhtsaModels.length === 0) continue;

                // Deduplicate models
                const uniqueModels = new Set<string>();
                nhtsaModels.forEach(m => {
                    const name = formatName(m.Model_Name);
                    // Filter out garbage (empty, numeric-only codes unless likely a model like "300")
                    if (name && name.length > 1) uniqueModels.add(name);
                });

                const modelsArray = Array.from(uniqueModels).sort().map(name => ({
                    make_id: make.id,
                    name
                }));

                const { error: modelError } = await supabaseClient
                    .from('car_models')
                    .upsert(modelsArray, { onConflict: 'make_id,name', ignoreDuplicates: true });

                if (modelError) {
                    console.error(`Error syncing models for ${make.name}:`, modelError);
                } else {
                    totalModels += modelsArray.length;
                }

            } catch (err) {
                console.error(`Failed to fetch/sync for ${make.name}`, err);
            }
        }

        return new Response(
            JSON.stringify({
                message: 'Sync complete',
                makes: insertedMakes.length,
                models: totalModels
            }),
            {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        )
    }
})

function formatName(str: string): string {
    if (!str) return ''
    return str.trim().split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
}
