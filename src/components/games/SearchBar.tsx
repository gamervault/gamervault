import { useRouter } from "next/router";
import { FormEvent } from "react";
import { useState } from "react";

function SearchBar(props: {className?: string}) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        if (searchQuery.length > 0) {
            const params = new URLSearchParams();
            params.set("query", searchQuery);
            router.push(`/games/search/?${params.toString()}`);
        }
    }

    return (
        <form className="w-full items-center flex flex-col" onSubmit={handleSearch}>
            <input type="text" 
            placeholder="e.g. colorful obby game that I can play with friends"
            className={`search-bar ${props.className || ""}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxLength={500}
             />
        </form>
    );
}

export default SearchBar;