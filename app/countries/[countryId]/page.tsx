import React from 'react'
import { Country } from '@/utils/types';

const apiUrl = "http://0.0.0.0:8001/api/latest/countries/"


export default async function country({ params }: { params: { countryId: string } }) {
  let url = apiUrl+params.countryId
  const res = await fetch(url, { cache: 'no-store' });
  console.log(url)
  if (res.status != 200){
    return <h1>No country with id {params.countryId}</h1>
}
  try {
    const result: Country = await res.json()
    console.log(result)
    return result;
  } catch (error) {
    console.log("error occurred")
    throw error
  }
}