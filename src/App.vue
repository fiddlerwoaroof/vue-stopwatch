<template>
    <div id="app">
	<header>
	    <h1>
		Timer
	    </h1>
	    <div>
		<button @click="mark">Go</button>
	    </div>
	</header>
	<ol>
	    <li class=header>
		<div>Time</div><div>Lap Time</div><div>Cumulative</div>
	    </li>
		
	    <li v-for="[time,diff,cum,new_annotation] in times">
		<div class="time">{{formatTime(time.time)}}</div>
		<div class="diff"><div class="time">{{formatDiff(diff)[0]}}</div><div class="mills">.{{formatDiff(diff)[1]}}</div></div>
		<div class="cum"><div class="time">{{formatDiff(cum)[0]}}</div><div class="mills">.{{formatDiff(cum)[1]}}</div></div>
		<div class="actions">
		    <form @submit.prevent="annotate(time.id, new_annotation)">
		    <input type=text v-model="new_annotation">
		    <button type="submit">+</button>
		    </form>
		</div>
		<ul v-show="time.annotations.length > 0">
		    <li class="annotation" v-for="annotation in time.annotations">
			<div>
			    {{annotation.text}}
			</div>
			<time datetime="annotation.time">{{formatTime(annotation.time)}}</time>
		    </li>
		</ul>
		
	    </li>
	</ol>
    </div>
  </template>

<script>

import {mapGetters} from 'vuex';

export default {
    name: 'app',
    data () {
	return {
	    msg: 'Welcome to Your Vue.js App',
	}
    },

    computed: {
	times() {
	    let result = [];
	    for (let cur of this.$store.state.times) {
		let diff = 0, cum = 0;
		if (cur.id > 0) {
		    cum = cur.time - result[cur.id-1][0].time;
		    diff = cur.time-result[0][0].time
		}

		result.unshift([cur, diff, cum, '']);
	    }
	    return result;
	},
    },

    methods: {
	annotate(idx, annotation) {
	    this.$store.commit('annotate', {idx, annotation});
	},
	mark() {
	    this.$store.commit('add');
	},

	formatTime: function (time) {
	    return (new Intl.DateTimeFormat('en-US', {
		year:'numeric', month:'numeric', day:'numeric', hour:'2-digit', minute: '2-digit', second:'2-digit'
	    })).format(time);
	},

	formatDiff(diff) {
	    let secs = Math.floor(diff/1000),
		mills = diff % 1000,
		mins = Math.floor(secs/60);
	    secs = secs % 60;
	    mins = `${mins}`;
	    if (mills.length < 3) {
		let pad = '0'*(3-mills.length);
		mills = pad + mills;
	    }
	    let result = `${secs}`
	    if (mins > 0) {
		result = `${mins}:${result.padStart(2,'0')}`;
	    }
	    return [result,mills];
	}
    },
}
    </script>

<style lang="scss">
  * { box-sizing: border-box; }
    #app {
	font-family: 'Lato', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: right;
	color: #2c3e50;
    }

    header {
	display: grid;
	grid-template-columns: 75fr 25fr;
	height: 3em;
	line-height: 3em;
	padding: 0;
    }
    
    h1, h2 {
	text-align: center;
	font-size: 1.25em;
	padding: 0;
	margin: 0;
    }

    ul {
	list-style-type: none;
	padding: 0;
    }

    a {
	color: #42b983;
    }

    ol {
	position: absolute;
	width: 100%;
	top: 4em;
	bottom: 0;
	left: 0;
	margin: 0;
	padding: 0 1em;
	padding-top: 3.25em;
	overflow-y: scroll;
	overflow-x: auto;
    }

    ol > li {
	display: grid;
	grid-template-columns: 25fr 12.5fr 12.5fr 25fr 25fr;
	padding: 0.5em;
	margin-bottom: 0.25em;
    }

    li.header {
	position: fixed;
	top: 4em;
	left: 1em;
	right: 1em;
	background: #eee;
    }

    ul {
	/* grid-column-start: 2; */
	/* grid-column-end: span 2; */
	padding: 0.25em;
	margin: 0.25em;
	padding-right: 0;
	margin-right: 0;
    }
    ul > li {
	padding: 0.2em 1em;
	background: #ffb;
	font-style: italic;
    }
    ul > li+li {
	border-top: 0.25em double #eee;
    }

    .diff, .cum {
	text-align: right;
    }
    
    .diff div, .cum div {
	display: inline-block;
    }

    .diff .time, .cum .time {
	max-width: 80%;
	text-align: right;
    }

    .diff .mills, .cum .mills {
	width: 20%;
	text-align: left;
    }

    button {
	height: 100%;
    }

    .annotation {
	color: #888;
	}
    .annotation time::before {
	content: "— "
    }
    .annotation time {
	font-size: 60%;

    }
</style>
