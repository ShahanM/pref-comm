import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useOutletContext } from "react-router-dom";
import ContinousCoupled from "../components/ContinuousCoupled";
import ContinousDecoupled from "../components/ContinuousDecoupled";
import { VizLabels, VizTypes } from "../utils/constants";
import DiscreteCoupled from "../components/DiscreteCoupled";


export function VizContainer() {
	const recommendations = useOutletContext();
	const [activeViz, setActiveViz] = useState(VizTypes.CONTINUOUS_COUPLED);

	return (
		<Container>
			<Row style={{backgroundColor: "lightgray"}}>
				<ul style={{ display: "flex" }}>
					{
						Object.keys(VizTypes).map((key) => {
							const type = VizTypes[key];
							return (
								<li key={key} className="vizPicker">
									<Button onClick={() => setActiveViz(type)}>
										{VizLabels[type]}
									</Button>
								</li>
							)
						})
					}
				</ul>
			</Row>
			<Row style={{backgroundColor: "lightgray"}}>
				<h2>{VizLabels[activeViz]}</h2>
			</Row>
			<Row  style={{backgroundColor: "beige"}}>
				<Visulization viztype={activeViz} data={recommendations} />
			</Row>
		</Container>
	)
}

function Visulization({ viztype, data }) {
	switch (viztype) {
		case VizTypes.CONTINUOUS_COUPLED:
			return <ContinousCoupled itemdata={data} />
		case VizTypes.CONTINUOUS_DECOUPLED:
			return <ContinousDecoupled itemdata={data} />
		case VizTypes.DISCRETE_COUPLED:
			return <DiscreteCoupled itemdata={data} />
		default:
			<></>

	}
}