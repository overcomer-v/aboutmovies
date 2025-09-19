export function Spinner({className}) {

    return (
        <div className="w-screen relative h-screen">
            <i className={`fa fa-spinner fa-spin ${className} fixed top-1/2 left-[45%]`}></i>
        </div>
    );
}