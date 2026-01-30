
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
        // Get all makes for passenger cars (id 2) to filter down a bit, or just get all.
        // NHTSA list is HUGE. Let's try "GetMakesForVehicleType/car"
        const makesRes = await fetch(`${NHTSA_BASE_URL}/GetMakesForVehicleType/car?format=json`)
        const makesData = await makesRes.json()
        const nhtsaMakes: NhtsaMake[] = makesData.Results

        console.log(`Found ${nhtsaMakes.length} makes. Syncing top makes...`)

        // IMPORTANT: Syncing ALL makes takes too long and has garbage data.
        // We will prioritize common makes + the user's requested "Toyota".
        // Actually, let's just insert them all but filter out duplicates/weird ones.
        // For performance in this demo, let's limit to top 100 or specific list if possible,
        // but the user wanted "every car".

        // We will batch insert makes.
        const uniqueMakes = new Set<string>()
        nhtsaMakes.forEach(m => {
            // Normalize: Title Case? NHTSA is often UPPERCASE
            const name = formatName(m.Make_Name)
            if (name) uniqueMakes.add(name)
        })

        // To respect the user's "click through" flow, we probably don't want 5000 makes.
        // But "Fix car models" implies completeness.
        // Let's blindly sync them.

        const makesArray = Array.from(uniqueMakes).sort().map(name => ({ name }))

        // Upsert Makes
        const { data: insertedMakes, error: makeError } = await supabaseClient
            .from('car_makes')
            .upsert(makesArray, { onConflict: 'name', ignoreDuplicates: false })
            .select()

        if (makeError) throw makeError
        console.log(`Synced ${insertedMakes.length} makes.`)

        // Now for each Make, fetch Models.
        // This is rate limited or slow? We might need to loop.
        // Use a delay or do it for just a few for the demo? 
        // The user said "on a timer... poll that list". 
        // In a real prod env, we'd queue this. For now, let's pick "Toyota" and "Honda" and "Ford" + others to ensure they work FIRST
        // then loop others.

        // Optimizing: Only fetch models for makes that are present in our local DB
        // Let's prioritize the ones we had hardcoded + others.
        const PRIORITY_MAKES = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Mazda', 'Hyundai', 'Kia', 'Subaru', 'Jeep', 'Ram', 'Tesla', 'Lexus', 'Acura', 'Dodge', 'GMC', 'Buick', 'Cadillac', 'Lincoln', 'Volvo', 'Porsche', 'Mitsubishi']

        // We will iterate through ALL inserted makes.
        for (const make of insertedMakes) {
            // Fetch models
            console.log(`Fetching models for ${make.name}...`)
            try {
                const modelsRes = await fetch(`${NHTSA_BASE_URL}/GetModelsForMake/${encodeURIComponent(make.name)}?format=json`)
                const modelsData = await modelsRes.json()
                const nhtsaModels: NhtsaModel[] = modelsData.Results

                if (!nhtsaModels || nhtsaModels.length === 0) continue

                const uniqueModels = new Set<string>()
                nhtsaModels.forEach(m => {
                    const name = formatName(m.Model_Name)
                    if (name) uniqueModels.add(name)
                })

                const modelsArray = Array.from(uniqueModels).sort().map(name => ({
                    make_id: make.id,
                    name
                }))

                const { error: modelError } = await supabaseClient
                    .from('car_models')
                    .upsert(modelsArray, { onConflict: 'make_id,name', ignoreDuplicates: true })

                if (modelError) console.error(`Error syncing models for ${make.name}:`, modelError)

            } catch (err) {
                console.error(`Failed to fetch/sync for ${make.name}`, err)
            }
        }

        return new Response(
            JSON.stringify({ message: 'Sync complete', makes: insertedMakes.length }),
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
