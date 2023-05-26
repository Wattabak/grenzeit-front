import React from 'react'
import { Country } from '@/utils/types';

const apiUrl = "http://0.0.0.0:8001/api/latest/countries/"


interface PaginatedResponse {
    items: Object[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

interface CountryListResponse {
    items: Country[];
    total: number;
    page: number;
    size: number;
    pages: number;
}


export default async function countries({ params }: { params: { countryId: string } }) {
    const res = await fetch(apiUrl, { cache: 'no-store' });

    try {
        const result: CountryListResponse = await res.json()
        return (
            <>
            <h1>Countries list</h1>
            <div>Total: {result.total}</div>
            <div>Current page: {result.page}</div>
            <div>{result.items[0].name_eng}</div>
            </>
        );
    } catch (error) {
        console.log(error)
        throw error;
    }
}