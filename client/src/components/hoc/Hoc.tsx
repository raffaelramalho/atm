function Organizer(WrappedComponent: React.ComponentType<any>) {
    return (props: any) => (
      <div className="mt-20 flex w-full overflow-hidden mx-10">
        <WrappedComponent {...props} />
      </div>
    );
  }
  
  export default Organizer