import { useSelector } from "react-redux";

export function useLoggedinUser() {
    return useSelector(state => state.storage?.user);
}