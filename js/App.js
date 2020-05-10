import React from 'react';
import styles from './../css/app.css'; 
import { setCookie, getCookie } from './helpers';
import Settings from './Settings';
import Table from './Table'; 
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			columns: null,
			data: null,
			lang: 'en',
			userName: String.fromCharCode(8230),
			title: String.fromCharCode(8230)
		};

		this.changeLang = this.changeLang.bind(this);
		this.renderEditable = this.renderEditable.bind(this);
		this.renderEditableDateTime = this.renderEditableDateTime.bind(this);
	}	

	changeLang( e ) {
		for( let i = 0 ; i < Settings.langs.length ; i++ ) {
			if( Settings.langs[i] === this.state.lang ) {
				let lang = ( i < Settings.langs.length-1 ) ? Settings.langs[i+1] : Settings.langs[0];  		
				this.setState( { lang: lang } );
				setCookie( 'lang', lang );
				break;
			}
		}
	}


	renderEditable(cellInfo) {
		return (
			<div
				style={{ backgroundColor: "#fafafa" }}
				contentEditable
				suppressContentEditableWarning
				onBlur={e => {
					console.log("cellInfo");
					console.log(cellInfo.index);
					console.log(cellInfo.original);
					console.log(cellInfo.column.id);
					const data = [...this.state.data];
			  		data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
			  		this.setState({ data: data });
				}}
				dangerouslySetInnerHTML={{
			  		__html: this.state.data[cellInfo.index][cellInfo.column.id]
				}}
		  	/>
		);
	}

	renderEditableDateTime(cellInfo) {
		let date = new Date();
		return (
			<DatePicker
				contentEditable
				suppressContentEditableWarning
				onChange = { date => { 
					const data = [...this.state.data];
			  		data[cellInfo.index][cellInfo.column.id] = date.toDateString();
					this.setState({ data: data });
					console.log(date);
				} }
			  	value={this.state.data[cellInfo.index][cellInfo.column.id]}
				dateFormat = {'17.01.2007'}
			/>
		);
	}


	componentDidMount() {
		let lang = getCookie('lang');
		if( lang !== null ) {
			this.setState( { lang:lang } );
		}

		let loaded = {
			title: 'Project Title',
			lang: 'ru',
			userName: 'User 1000',
			columns: [ 
				{title:"Уровень",key:"Level","visible":true,"width":2,"type":"int","format":0},
				{title:"Код",key:"Code","visible":true,"width":17,"type":"string","format":0},
				{title:"Название",key:"Name","visible":true,"width":40,"type":"string","format":0},
				{title:"Начало периода",key:"Start","visible":true,"width":17,"type":"datetime","format":1, editable:true},
				{title:"Окончание периода",key:"Fin","visible":true,"width":17,"type":"datetime","format":0, editable:true},
				{title:"Ответственный",key:"Person","visible":true,"width":17,"type":"string","format":0},
				{title:"Объём [Было]",key:"VolPlan","visible":true,"width":17,"type":"float","format":0, editable:true},
				{title:"Объём [Выполнено]",key:"VolDone","visible":true,"width":17,"type":"float","format":1, editable:true},
				{title:"Объём [Остаток]",key:"VolRest","visible":true,"width":17,"type":"float","format":1, editable:true},
				{title:"Длительность, Часы [Было]",key:"TeamDur","visible":true,"width":17,"type":"float","format":0, editable:true},
				{title:"Длительность, Часы [Остаток]",key:"DurRest","visible":true,"width":17,"type":"float","format":2, editable:true},
				{title:"Длительность, Часы [Пройдено]",key:"DurDone","visible":true,"width":17,"type":"float","format":2, editable:true}							
			],
			data: [
				{"Level":1,"Code":"main","Name":"Приобретение программы","Start":"17.01.2007","Fin":"14.02.2007","Person":null,"VolPlan":null,"VolDone":null,"VolRest":null,"TeamDur":null,"DurRest":null,"DurDone":null,"f_FontColor":null,"f_ColorBack":"13233656"},
				{"Level":2,"Code":"Груша","Name":"Требования и рынок","Start":"17.01.2007","Fin":"25.01.2007","Person":"ivanov, petrov","VolPlan":null,"VolDone":null,"VolRest":null,"TeamDur":null,"DurRest":null,"DurDone":null,"f_FontColor":"255","f_ColorBack":"13434828"},
				{"Level":null,"Code":"ww","Name":"Операция4","Start":"17.01.2007","Fin":"17.01.2007","Person":null,"VolPlan":"40.0","VolDone":"40.0","VolRest":null,"TeamDur":null,"DurRest":null,"DurDone":null,"f_FontColor":null,"f_ColorBack":"16777215"},
				{"Level":"A","Code":"me","Name":"Менеджер проекта","Start":"17.01.2007","Fin":"17.01.2007","Person":null,"VolPlan":"40.0","VolDone":null,"VolRest":null,"TeamDur":null,"DurRest":null,"DurDone":null,"f_FontColor":null,"f_ColorBack":"14745599"},
			]
		};

		if( loaded === null ) {
			this.setState( { data: { 'error': Settings.failedToLoadText[this.state.lang] } } );
			return;
		}
		if( !('data' in loaded) || loaded.data.length === 0 ) {
			this.setState( { data: { 'error': Settings.failedToParseText[this.state.lang] } } );
			return;
		}

		let columns = [];
		for( let i = 0 ; i < loaded.columns.length ; i++ ) {
			let push = { Header: loaded.columns[i].title, accessor: loaded.columns[i].key };
			if( 'editable' in loaded.columns[i] && loaded.columns[i].editable) {
				if( loaded.columns[i].type === 'datetime' ) {
					push.Cell = this.renderEditableDateTime;
				} else {
					push.Cell = this.renderEditable;
				}
			} 
			columns.push( push );	
		}
		this.setState( { columns: columns, data: loaded.data, 
			title: loaded.title, lang: loaded.lang, userName: loaded.userName } );
	}

	render() {		
		var header = (		
			<div className={styles.headerContainer}>
				<div className={styles.headerControls}>
					<span onClick={this.changeLang}>{ Settings.lang[ this.state.lang ] }</span>
					<span>{ String.fromCharCode(8634) }</span>
					<span>{ String.fromCharCode(9783) }</span>
				</div>
				<div className={styles.headerTitle}>{ this.state.title }</div>
				<div className={styles.headerUser}>{ this.state.userName } :: { Settings.exitText[this.state.lang] }</div>
			</div>
		);

		let data = this.state.data;
		if( data === null || 'error' in data ) {
			let errorMessage = (data===null) ? Settings.waitLoadingText[this.state.lang] : data.error;
			return( 
				<div className={styles.appContainer}>
					{header}
					<div className={styles.waitContainer}>{errorMessage}</div>
				</div> );
		}

			try {
				return (
					<div className = {styles.appContainer}>
						{header}
						<div className = {styles.contentContainer}> 
						<Table columns={this.state.columns} data={this.state.data}/>
						</div>
					</div>
				);
			} catch(e) {
				console.log("ERROR:");
				console.log(e);
			}
		
		return( 
			<div className={styles.appContainer}>
				{header}
				<div className={styles.waitContainer}>{Settings.failedToParseText[this.state.lang]}</div>
			</div> 
		);
	}
}

export default App;