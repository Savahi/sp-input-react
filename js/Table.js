import React from 'react';
import styles from './../css/app.css'; 
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import Settings from './Settings';


class Table extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
		};
	}

	render() {

		if( this.props.data.length === 0 ) {
			return (
				<div>NO DATA</div>
			);
		}

		return (
				<ReactTable
					data = {this.props.data}
					columns = {this.props.columns}
					showPagination = {false}
					sortable = {false}
				/>
		);
	}
}

export default Table;