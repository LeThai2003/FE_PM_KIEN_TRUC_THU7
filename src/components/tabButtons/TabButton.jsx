const TabButton = ({name, icon : Icon, activeTab, setActiveTab}) => {

  const isActive = activeTab === name;

  return (
    <button 
      className={`relative flex items-center gap-2 px-1 py-2 before:absolute before:w-full before:h-[1px] before:left-0 before:-bottom-[9px] hover:text-blue-600 dark:hover:text-white transition-all duration-300 ${isActive ? "text-blue-600 before:bg-blue-600" : "text-gray-500"}`}
      onClick={() => setActiveTab(name)}
    >
      {Icon}
      {name}
    </button>
  )
}

export default TabButton;