import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const Teste = _ => {

    const [searchParams] = useSearchParams();

    return(
        <div>
            <h2>{searchParams.get("caminho")}</h2>
            <h2>{searchParams.get("id")}</h2>
        </div>
    )
}

export default Teste