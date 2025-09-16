const Loader = () => {
  return (
    <div className="flex justify-center items-center mt-[290px]">
      <div className="relative w-[200px] h-[22px] border-2 border-[#10B981] rounded-[20px] overflow-hidden">
        <div className="absolute top-[2px] left-[2px] right-[2px] bottom-[2px] bg-[#10B981] rounded-[inherit] animate-loader-fill origin-left"></div>
      </div>
    </div>
  );
};

export default Loader;
