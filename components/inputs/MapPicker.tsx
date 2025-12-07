"use client"

import { useState, useEffect, useMemo } from "react"
// 1. Adicionei o 'Popup' na importação
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// --- COMPONENTE INTERNO (Lida com o clique) ---
function LocationMarker({ onSelect, position, setPosition, customIcon }: any) {
    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng
            setPosition([lat, lng])
            onSelect(String(lat), String(lng))
            map.flyTo(e.latlng, map.getZoom()) // Opcional: Centraliza onde clicou
        },
    })

    if (!position) return null;

    // 2. Envolvemos o Popup dentro do Marker
    return (
        <Marker position={position} icon={customIcon}>
            <Popup>
                <div className="text-center text-sm">
                    <strong className="block mb-1">Local Selecionado</strong>
                    <span>Lat: {position[0]?.toFixed(6)}</span>
                    <br />
                    <span>Lng: {position[1]?.toFixed(6)}</span>
                </div>
            </Popup>
        </Marker>
    )
}

interface MapPickerProps {
    initialLat?: string
    initialLng?: string
    onSelect: (lat: string, lng: string) => void
}

export default function MapPicker({ initialLat, initialLng, onSelect }: MapPickerProps) {
    const [isMounted, setIsMounted] = useState(false)

    const defaultPosition: [number, number] = initialLat && initialLng
        ? [Number(initialLat), Number(initialLng)]
        : [-5.1462, -38.0963]

    const [position, setPosition] = useState<[number, number] | null>(
        initialLat && initialLng ? [Number(initialLat), Number(initialLng)] : null
    )

    const customIcon = useMemo(() => {
        return new L.Icon({
            // Seus caminhos da pasta public
            iconUrl: "/leaflet/marker-icon.png",
            shadowUrl: "/leaflet/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34], // Ajusta a posição do balão pra ficar na ponta do pino
            shadowSize: [41, 41]
        })
    }, [])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <div className="h-[300px] w-full bg-muted animate-pulse rounded-md flex items-center justify-center text-muted-foreground">
                Carregando mapa...
            </div>
        )
    }

    return (
        <div className="h-[300px] w-full rounded-md overflow-hidden border z-0 relative">
            <MapContainer
                key={`${isMounted}`}
                center={defaultPosition}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationMarker
                    onSelect={onSelect}
                    position={position}
                    setPosition={setPosition}
                    customIcon={customIcon}
                />
            </MapContainer>
        </div>
    )
}