import React from 'react'
import { Country } from '@/utils/types';

interface CountryProps {
  params: {
    countryId: string
  }
}
const apiHost = `${process.env.NEXT_PUBLIC_GRENZEIT_API_SCHEME}://${process.env.NEXT_PUBLIC_GRENZEIT_API_HOST}/api/latest/`

async function getCountry(id: string) {
  const res = await fetch(`${apiHost}countries/${id}`, { cache: 'no-store' });
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error(`Failed to fetch country ${id}`);
  }
  return res.json()
}

const country = async ({ params }: CountryProps) => {
  const result: Country = await getCountry(params.countryId)
  console.log(result)
  return (
    <div>
      <h1>{result.name_eng}</h1>
      <ul>
        {
          Object.entries(result).map(([k, value]) => {
            return <li key={k}>{k}: {value}</li>
          })
        }
      </ul>
    </div>
  );
}

export default country;