import React from "react";

const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
        <div className="row">
            <div className="col-lg-12">
                <div className="input-group">
                    <input
                        id="search"
                        type="text"
                        placeholder="Filtrar tabela..."
                        value={filterText}
                        onChange={onFilter}
                        className="form-control"
                    />
                    <div className="input-group-append">
                        <button className="btn btn-sm btn-inverse-danger btn-rounded" onClick={onClear}>X</button>
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default FilterComponent;
