/**
* Create an application that can search for a user by the "username" field.
*
* Requriemets:
*  1. One field for entering a search query.
*  2. The API call must be made when data is entered.
*  3. Suggest optimization and improvement options. (optional)
*/

function getPeople(searchText: string, options = {}) {
  return fetch(
    `https://jsonplaceholder.typicode.com/users?username=${searchText}`,
    options
  )
    .then((response) => response.json())
    .then((data) => data);
}

// Implementation

import { useState, useEffect, useCallback } from "react";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
}

export const Search = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async (query: string) => {
        if (!query.trim()) {
            setUsers([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await getPeople(query);
            setUsers(data);
        } catch (err) {
            setError("Failed to fetch users");
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    },[]);

    useEffect(() => {
        fetchUsers(searchText);
    }, [searchText, fetchUsers]);

    return (
        <div>
            <input
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by username..."
            />
            
            {isLoading && <div>Loading...</div>}
            
            {error && <div style={{ color: 'red' }}>{error}</div>}
            
            {users.length > 0 ? (
                <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <div><strong>Username:</strong> {user.username}</div>
                        <div><strong>Name:</strong> {user.name}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                    </li>
                ))}
                </ul>
            ) : (
                !isLoading && !error && searchText && (
                    <div>No users found</div>
                )
            )}
        </div>
    );
}
