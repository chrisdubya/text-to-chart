import { useEffect, useState, useRef, useCallback } from "react";
import * as d3 from "d3";

const Home = () => {
	const [genre, setGenre] = useState("");
	const [result, setResult] = useState(null);
	const svgRef = useRef(null);
	const initChart = useCallback((chartData) => {
		chartData = chartData.sort((a, b) => a.year - b.year);

		const svg = d3.select(svgRef.current);
		var bounds = svg.node().getBoundingClientRect();
		const margin = { top: 20, right: 30, bottom: 30, left: 40 };
		var width = bounds.width - margin.left - margin.right;
		var height = bounds.height - margin.top - margin.bottom;

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
			g
				.attr("transform", `translate(0,${height - margin.bottom})`)
				.style("color", "#CAF0F8")
				.call(
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
				.style("color", "#CAF0F8")
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
		let tooltip = d3.select(".tooltip-area").style("opacity", 0);

		const mouseover = (event, d) => {
			tooltip.style("opacity", 1);
		};

		const mouseleave = (event, d) => {
			// tooltip.style('opacity', 0);
		};

		const mousemove = (event, d) => {
			const text = d3.select(".tooltip-text");
			text.style("fill", "white").text(`${d.title}: ${d.year}`);
			const [x, y] = d3.pointer(event);

			tooltip.attr("transform", `translate(${x}, ${y})`);
		};

		svg
			.select(".plot-area")
			.attr("fill", "#FFC4D1")
			.selectAll(".bar")
			.data(chartData)
			.join("rect")
			.attr("class", "bar")
			.attr("x", (d) => x(d.year))
			.attr("width", x.bandwidth())
			.attr("y", (d) => y1(d.metaScore))
			.attr("height", (d) => y1(0) - y1(d.metaScore))
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)
			.on("mouseover", mouseover);

		window.addEventListener("resize", () => {
			initChart(chartData);
		});
	});

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
	}, [initChart, result]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		// const response = await fetch("/api/generate", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		query: `
		// 			A three-column spreadsheet of top ${genre} movies and the year of release and the metascore:Title,Year of release|Metascore
		// 		`,
		// 	}),
		// });
		// const data = await response.json();
		// setResult(data.result);

		const data =
			"\n\nBlade Runner,1982|91\nThe Matrix,1999|83\nThe Terminator,1985|25\nThe Hitchhiker's Guide to the Galaxy,1996|88";
		setResult(data);
	};

	useEffect(() => {
		if (result !== null) {
			handleResult();
		}
	}, [result, handleResult]);

	return (
		<>
			<main className='h-screen container mx-auto flex flex-col md:justify-center md:align-middle'>
				<svg
					ref={svgRef}
					className={`${result ? "visible" : "hidden"} h-[500px] w-full mx-0`}>
					<g className='plot-area' />
					<g className='x-axis' />
					<g className='y-axis' />
					<g className='tooltip-area pointer-events-none bg-white px-4 py-8'>
						<text className='font-anek tooltip-text text-white'></text>
					</g>
				</svg>

				<form
					className='text-2xl md:flex self-center font-anek text-light-cyan'
					onSubmit={handleSubmit}>
					<div>make me a chart of the best </div>
					<input
						className='md:text-center bg-oxford-blue text-light-cyan placeholder:text-pacific-blue focus:bg-oxford-blue'
						type='text'
						name='genre'
						placeholder='genre'
						value={genre}
						onChange={(e) => setGenre(e.target.value)}
					/>
					<div>movies&nbsp;</div>
					<input
						className=' ml-2 bg-light-cyan text-oxford-blue px-2 rounded-md'
						type='submit'
						value='go!'
					/>
				</form>
			</main>
		</>
	);
};

export default Home;
