import { useEffect, useState, useRef, useCallback } from "react";
import * as d3 from "d3";

const Home = () => {
	const [result, setResult] = useState(null);
	const svgRef = useRef(null);

	const handleResult = useCallback(() => {
		console.log(result);
		let mainStr = result.substring(1);
		mainStr = mainStr.match(/\n(.*)/g);
		let chartData = [];

		const setChartData = async () => {
			for (let i = 0; i < mainStr.length; i++) {
				let titleQuery = mainStr[i].match(/(.*),/g);
				let yearQuery = mainStr[i].match(/,(.*)\|/g);
				let metaScoreQuery = mainStr[i].match(/\|(.*)/g);
				if (
					titleQuery !== null &&
					yearQuery !== null &&
					metaScoreQuery !== null
				) {
					titleQuery = titleQuery[0].replaceAll("\t", "");
					let title = titleQuery.slice(0, -1);
					let year = Number(yearQuery[0].substring(1).slice(0, -1));
					let metaScore = Number(metaScoreQuery[0].substring(1));
					chartData.push({ title: title, year: year, metaScore: metaScore });
					console.log(chartData);
				}
			}
			initChart(chartData);
		};

		setChartData();
	}, [result]);

	useEffect(() => {
		if (result !== null) {
			handleResult();
		}
	}, [result, handleResult]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const response = await fetch("/api/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: `
					A three-column spreadsheet of top science fiction movies and the year of release and the metascore:Title,Year of release|Metascore
				`,
			}),
		});
		const data = await response.json();
		setResult(data.result);

		// const data =
		// 	"\n\nBlade Runner,1982|91\nThe Matrix,1999|83\nThe Terminator,1985|25\nThe Hitchhiker's Guide to the Galaxy,1996|88";
		// setResult(data);
	};

	const initChart = (chartData) => {
		chartData = chartData.sort((a, b) => a.year - b.year);
		console.log(chartData);
		const svg = d3.select(svgRef.current);

		const width = window.innerWidth;
		const height = window.innerHeight / 2;
		const margin = { top: 20, right: 30, bottom: 30, left: 40 };

		const x = d3
			.scaleBand()
			.domain(chartData.map((d) => d.year))
			.rangeRound([margin.left, width - margin.right])
			.padding(0.1);

		const y1 = d3
			.scaleLinear()
			.domain([0, d3.max(chartData, (d) => d.metaScore)])
			.rangeRound([height - margin.bottom, margin.top]);

		const xAxis = (g) =>
			g.attr("transform", `translate(0,${height - margin.bottom})`).call(
				d3
					.axisBottom(x)
					.tickValues(
						d3
							.ticks(...d3.extent(x.domain()), width / 40)
							.filter((v) => x(v) !== undefined)
					)
					.tickSizeOuter(0)
			);

		const y1Axis = (g) =>
			g
				.attr("transform", `translate(${margin.left},0)`)
				.style("color", "steelblue")
				.call(d3.axisLeft(y1).ticks(null, "s"))
				.call((g) => g.select(".domain").remove())
				.call((g) =>
					g
						.append("text")
						.attr("x", -margin.left)
						.attr("y", 10)
						.attr("fill", "currentColor")
						.attr("text-anchor", "start")
						.text(chartData.y1)
				);

		svg.select(".x-axis").call(xAxis);
		svg.select(".y-axis").call(y1Axis);

		svg
			.select(".plot-area")
			.attr("fill", "steelblue")
			.selectAll(".bar")
			.data(chartData)
			.join("rect")
			.attr("class", "bar")
			.attr("x", (d) => x(d.year))
			.attr("width", x.bandwidth())
			.attr("y", (d) => y1(d.metaScore))
			.attr("height", (d) => y1(0) - y1(d.metaScore));
	};

	return (
		<>
			<button className='text-xl text-blue' onClick={handleSubmit}>
				Click me
			</button>

			<svg
				ref={svgRef}
				style={{
					height: 500,
					width: "100%",
					marginRight: "0px",
					marginLeft: "0px",
				}}>
				<g className='plot-area' />
				<g className='x-axis' />
				<g className='y-axis' />
			</svg>
		</>
	);
};

export default Home;
