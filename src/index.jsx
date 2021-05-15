import * as $ from 'jquery'
import React from 'react'
import ReactDom from 'react-dom'
// '@models' - path in import from alias (webpack.config.ja)
import Post from '@models/Post'
import './styles/style.css'
import './styles/less.less'
import './styles/scss.scss'
import './babel'
import Hello from './components/hello/componentFile.jsx'
import Rise from './components/rise/rise'
// import json from './assets/json'
// import xml from './assets/data.xml'
// import csv from './assets/data.csv'

// path in import from alias (webpack.config.ja)
import WebpackLogo from '@/assets/webpack-logo.png'


const post = new Post('Webpack Post Title', WebpackLogo);

//console.log('Post to String :' , post.toString());

$('pre').html(post.toString());


const App = () => (
    <div className="container">
        <h1>Webpack Webpack</h1>
        <hr />
        <div className="logo"/>
        <hr />
        <pre className="code"/>
        <hr />
        <div className="box">
            <h2>Less</h2>
        </div>
        <hr />
        <div className="card">
            <h2>SCSS</h2>
        </div>
        <hr />
        <div className="card">
            <>
            <Hello />
            <Hello name="Andrey" />
            </>
        </div>
        <hr />
        <div className="card">
            <>
            <Rise />
            <Rise name="Super Andrey" />
            </>
        </div>
    </div>
);

ReactDom.render(<App/>, document.getElementById('app'));

// console.log('JSON :', json);
// console.log('XML :', xml);
//console.log('CSV :', csv);