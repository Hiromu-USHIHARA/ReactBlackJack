export default function Card({suit, value}){
    return (
        <div style={{
            border: "1px solid #000",
            padding: "10px",
            margin: "5px",
            display: "inline-block",
            width: "40px",
            textAlign: "center"
        }}>
            <div>{value}</div>
            <div>{suit}</div>
        </div>
    );
}