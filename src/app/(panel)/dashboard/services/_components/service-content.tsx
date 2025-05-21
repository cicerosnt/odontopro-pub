import { getAllServices } from "../_data-access/getAllServices"
import { ServicesList } from "./service-list"

interface ServiceContentProps{
    userId: string
}

export async function ServicesContent({userId}: ServiceContentProps) {

    const services = await getAllServices(userId)
    
    // console.log(services)
    
    return (
        <ServicesList
            services={services.data || []}
        />
    )
}
