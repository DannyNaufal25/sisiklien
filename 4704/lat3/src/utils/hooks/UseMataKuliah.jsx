// Utils/Hooks/useMataKuliah.jsx
import { useQuery } from "@tanstack/react-query";
import { getAllMataKuliah } from "../apis/MataKuliahApi";

export const useMataKuliah = () =>
  useQuery({
    queryKey: ["mata-kuliah"],
    queryFn: getAllMataKuliah,
    select: (res) => res?.data ?? [],
  });