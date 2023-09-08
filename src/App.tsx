import { State, process } from '@progress/kendo-data-query';
import { Window, WindowActionsEvent } from '@progress/kendo-react-dialogs';
import { DropDownList, DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import { Grid, GridColumn, GridDataStateChangeEvent, GridRowClickEvent } from '@progress/kendo-react-grid';
import '@progress/kendo-theme-default/dist/all.css';
import { useEffect, useState } from 'react';
import categories from './categories.json';
import products from './products.json';

interface AppState {
    dropdownlistCategory: string;
    gridDataState: State;
    windowVisible: boolean;
    gridClickedRow: any;
}

const initState: AppState = {
    dropdownlistCategory: '',
    gridDataState: {
        sort: [{ field: 'ProductName', dir: 'asc' }],
        skip: 0,
        take: 10
    },
    windowVisible: false,
    gridClickedRow: {}
};

const App = () => {
    const [state, setState] = useState<AppState>(initState);

    const handleDropDownChange = (e: DropDownListChangeEvent) => {
        const newDataState = { ...state.gridDataState };
        if (e.target.value.CategoryID !== null) {
            newDataState.filter = {
                logic: 'and',
                filters: [{ field: 'CategoryID', operator: 'eq', value: e.target.value.CategoryID }]
            };
            newDataState.skip = 0;
        } else {
            newDataState.filter = undefined;
            newDataState.skip = 0;
        }
        setState({ ...state, dropdownlistCategory: e.target.value.CategoryID, gridDataState: newDataState });
    };

    useEffect(() => console.log({ state }), [state]);

    const handleGridDataStateChange = (e: GridDataStateChangeEvent) => {
        setState({ ...state, gridDataState: e.dataState });
    };

    const handleGridRowClick = (e: GridRowClickEvent) => {
        setState({ ...state, windowVisible: true, gridClickedRow: e.dataItem });
    };

    const closeWindow = (e: WindowActionsEvent) => {
        setState({ ...state, windowVisible: false });
    };

    const checkboxColumn = (props: any) => {
        return (
            <td>
                <input type='checkbox' checked={props.dataItem[props.field]} disabled={true} />
            </td>
        );
    };

    return (
        <div className='App'>
            <h1>Hello KendoReact!</h1>
            <p>
                <DropDownList
                    data={categories}
                    dataItemKey='CategoryID'
                    textField='CategoryName'
                    defaultItem={{ CategoryID: null, CategoryName: 'Product categories' }}
                    onChange={handleDropDownChange}
                />
                &nbsp; Selected category ID: <strong>{state.dropdownlistCategory}</strong>
            </p>
            <Grid
                data={process(products, state.gridDataState)}
                pageable={true}
                sortable={true}
                {...state.gridDataState}
                onDataStateChange={handleGridDataStateChange}
                style={{ height: '400px' }}
                onRowClick={handleGridRowClick}>
                <GridColumn field='ProductName' title='Product Name' />
                <GridColumn field='UnitPrice' title='Price' format='{0:c}' />
                <GridColumn field='UnitsInStock' title='Units in Stock' />
                <GridColumn field='Discontinued' cell={checkboxColumn} />
            </Grid>

            {state.windowVisible && (
                <Window title='Product Details' onClose={closeWindow} height={250}>
                    <dl>
                        <dt>Product Name</dt>
                        <dd>{state.gridClickedRow.ProductName}</dd>
                        <dt>Product ID</dt>
                        <dd>{state.gridClickedRow.ProductID}</dd>
                        <dt>Quantity per Unit</dt>
                        <dd>{state.gridClickedRow.QuantityPerUnit}</dd>
                    </dl>
                </Window>
            )}
        </div>
    );
};
export default App;
