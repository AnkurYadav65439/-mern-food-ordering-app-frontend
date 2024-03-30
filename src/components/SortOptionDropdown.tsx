import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "./ui/dropdown-menu";

type Props = {
    onChange: (value: string) => void;
    sortOption: string;
}

const SORT_OPTIONS = [
    //label for here, value goes for backend
    {
        label: "Best Match",
        value: "bestMatch"
    },
    {
        label: "Delivery Price",
        value: "deliveryPrice"
    },
    {
        label: "Estimated Delivery Time",
        value: "estimatedDeliveryTime"
    },
];

const SortOptionDropdown = ({ onChange, sortOption }: Props) => {
    const SelectedSortOption = SORT_OPTIONS.find((option) => option.value === sortOption)?.label || SORT_OPTIONS[0].label;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
                <Button variant="outline" className="w-full">
                    Sort by: {SelectedSortOption}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem className="cursor-pointer" onClick={() => onChange(option.value)}>
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SortOptionDropdown