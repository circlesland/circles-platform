export interface OfferLocation
{
    place_id: number,
    licence: string,
    osm_type: string,
    osm_id: number,
    boundingbox: number[],
    lat: number,
    lon: number,
    display_name: string,
    class: string,
    type: string,
    importance: number,
    icon: string
}