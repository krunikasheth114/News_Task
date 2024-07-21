import { FormControlLabel, Switch, TablePagination } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';

const Table = ({
    listData,
    headCell,
    tableTitle,
    page,
    rowsPerPage,
    totalArticles,
    setPage,
    setRowsPerPage,
    setColumnVisibility, columnVisibility,
    setFilterValue,
    filterValue,
    selectedDate,
    setSelectedDate
}) => {

    const [sortBy, setSortBy] = React.useState(null);
    const [sortOrder, setSortOrder] = React.useState('asc');


 
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function descendingComparator(a, b, sortBy) {
        if (b[sortBy]?.toString()?.toLowerCase() < a[sortBy]?.toString()?.toLowerCase()) {
            return -1;
        }
        if (b[sortBy]?.toString()?.toLowerCase() > a[sortBy]?.toString()?.toLowerCase()) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, sortBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, sortBy)
            : (a, b) => -descendingComparator(a, b, sortBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array?.map((el, index) => [el, index]);
        stabilizedThis?.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis?.map((el) => el[0]);
    }

    const handleSort = (key) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    const handleColumnVisibility = (key) => {
        setColumnVisibility((prevVisibility) => {
            if (key === 'all') {
                const newVisibility = Object.keys(prevVisibility).reduce((acc, columnKey) => {
                    acc[columnKey] = prevVisibility[columnKey] === true;
                    return acc;
                }, {});
                return newVisibility;
            } else {
                console.log(key, 'key')
                return {
                    ...prevVisibility,
                    [key]: prevVisibility[key] === 'none' ? true : 'none',
                };
            }
        });
    };

    const handleDate = (newValue) => {
        console.log(newValue);
        let date =  new Date(newValue).toLocaleDateString()
        setSelectedDate(date)
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    {tableTitle}
                </h4>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search"
                        value={filterValue}
                        onChange={(e) => {
                            setFilterValue(e.target.value);
                            setPage(0);
                        }}

                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <label htmlFor="">Hide/Show Columns :</label>
                {headCell.map((cellItem) => (
                    <FormControlLabel control={<Switch onChange={(e) => {
                        handleColumnVisibility(cellItem?.key)
                    }} />} label={cellItem?.lable}
                    />
                ))}


                <DatePicker label="Basic date picker" onChange={(newValue) => handleDate(newValue)} />

            </div>

            {/* Table */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                {headCell.map((cellItem, key) => (
                                    <th key={key} className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11" style={{ display: columnVisibility[cellItem.key] }} >
                                        <h5 className="text-sm font-medium uppercase xsm:text-base cursor-pointer" onClick={() => handleSort(cellItem.key)} >
                                            {cellItem.lable}
                                            {sortBy === cellItem.key && (
                                                <span>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>
                                            )}
                                        </h5>

                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stableSort(listData, getComparator(sortOrder, sortBy))?.map((row, index) => (
                                <tr key={index}>
                                    {headCell.map((cellItem, cellIndex) => (
                                        <td key={cellIndex} className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11" style={{ display: columnVisibility[cellItem.key] }}>
                                            {row[cellItem.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {listData?.length === 0 && (
                                <tr>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11" colSpan={headCell.length}>
                                        <p className="text-black dark:text-white">Record Not Found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <TablePagination
                component="div"
                rowsPerPageOptions={[10, 25, 50, 100]}
                count={totalArticles}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default Table;
