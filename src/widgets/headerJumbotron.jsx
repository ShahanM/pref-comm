import DOMPurify from "dompurify";
import parse from "html-react-parser";

export default function HeaderJumbotron(props) {

	const cleanContent = DOMPurify.sanitize(props.content);
	const cleanPageDescription = DOMPurify.sanitize(props.pageInstruction);
	const clean = `${cleanContent} ${cleanPageDescription}`;
	const parsed = parse(clean);

	return (
		<div className="jumbotron">
			<h1 className="header">{props.title}</h1>
			<div style={{ width: "fit-content", margin: "auto", textAlign: "left" }}>
				{parsed}
			</div>
		</div>
	)
}