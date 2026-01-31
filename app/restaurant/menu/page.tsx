import { MenuManagement } from "@/components/restaurant/MenuManagement";

export default function MenuPage() {
    return (
        <div className="container mx-auto py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
                <p className="text-muted-foreground mt-2">
                    Configure your restaurant menu, prices, and available items.
                </p>
            </div>
            <MenuManagement />
        </div>
    );
}
