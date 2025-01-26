export type Validator = {
    publickey: string;
    valid_signature: boolean;
    validatorindex: number;
};


export async function fetchValidators(beaconExplorerUrl: string, address: string): Promise<Validator[]> {
    try {
        const response = await fetch(`${beaconExplorerUrl}/api/v1/validator/eth1/${address}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch from ${beaconExplorerUrl} - status: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching validator statuses:", error);
        throw error;
    }
}

