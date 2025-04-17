export default function Controls({onHit, onStand, disabled}){
    return (
        <div style={{marginTop: "20px"}}>
            <button onClick={onHit} disabled={disabled}>Hit</button>
            <button onClick={onStand} disabled={disabled} style={{marginLeft: "10px"}}>Stand</button>
        </div>
    );
}