export default function Page() {
  return (
    <div className="bg-[#f5f5f5] p-[30px] min-h-[100vh]">
      <div className="container">
        <div className="bg-white rounded-[5px] text-center p-[30px] shadow-md">
          <div className="flex">
            <label className="whitespace-nowrap mt-1 w-[150px]">
              <span className="text-red-500 mr-1 text-[12px]">*</span>
              Name
            </label>
            <input
              type="text"
              name="Name"
              className="w-full px-[10px] py-[5px] border-[1px] rounded-[5px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
