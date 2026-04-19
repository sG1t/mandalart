import { Suspense } from "react";
import Chart from "./chart";

export default function Page() {
    return (
        <Suspense fallback={<div>...Loading</div>}>
            <Chart></Chart>
        </Suspense>
    )
}