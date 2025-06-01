import React, { useEffect, useState } from 'react'
import HomeLayout from '../../components/Layouts/HomeLayout'
import ProjectHeader from '../../components/projects/ProjectHeader';
import ViewBoardProject from './Board';
import ModalNewTask from '../../components/tasks/ModalNewTask';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, removeTask, setTasks, updateTask } from '../../redux/tasks/taskSlice';
import { convertToSlug } from '../../utils/converToSlug';
import ListProject from './ListProject';
import TableProject from './TableProject';
import TimelineProject from './TimelineProject';
import { socket } from '../../utils/socket/socket';

const Project = () => {

  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const {id} = useParams();
  
  const dispatch = useDispatch();
  const {tasks} = useSelector(state => state.tasks);
  const {currentUser} = useSelector(state => state.users);

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const getDataTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASK.GET_ALL, {
        params: {
          projectId: id
        }
      });
      dispatch(setTasks(response.data.tasks));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getDataTasks();
    setSearch("");
  }, [id]);

  useEffect(() => {
    if (search.trim() === "") 
    {
      setSearchResult(tasks); 
    } 
    else 
    {
      const searchSlug = convertToSlug(search);
      const filteredTasks = tasks.filter(task =>
        task.slugTitle.toLowerCase().includes(searchSlug) ||
        task.description?.toLowerCase().includes(search.toLowerCase()) ||
        convertToSlug(task.authorUserId.fullname).includes(searchSlug) ||
        convertToSlug(task.assigneeUserId?.fullname)?.includes(searchSlug) ||
        convertToSlug(task.tags)?.includes(searchSlug) ||
        task.priority.toLowerCase().includes(search.toLocaleLowerCase()) ||
        task.status.toLowerCase().includes(search.toLocaleLowerCase())
      );
      setSearchResult(filteredTasks);
    }
  }, [search, tasks]);

  useEffect(() => {
    socket.on("SERVER_RETURN_NEW_TASK", (data) => {
      console.log("---------SERVER_RETURN_NEW_TASK----------", data);
      if(data.relatedUserNotify.includes(currentUser._id))
      {
        dispatch(addTask(data.task));
      }
    });

    socket.on("NOTIFY_SERVER_DELETE_TASK", (data) => {
      // console.log("-------------------delete notification ---------------------")
      if(data.userId == currentUser._id)
      {
        dispatch(removeTask(data.taskId));
      }
    });

    socket.on("UPDATE_TASK_DRAG_DROP", (data) => {
      // console.log("-------------------delete notification ---------------------")
      if(data.relatedUserNotify.includes(currentUser._id))
      {
        dispatch(updateTask(data.task));
      }
    });

    socket.on("UPDATE_TASK", (data) => {
      // console.log("-------------------delete notification ---------------------")
      if(data.relatedUserNotify.includes(currentUser._id))
      {
        dispatch(updateTask(data.task));
      }
    });

    return () => {
      socket.off("SERVER_RETURN_NEW_TASK");
      socket.off("NOTIFY_SERVER_DELETE_TASK");
      socket.off("UPDATE_TASK_DRAG_DROP");
      socket.off("UPDATE_TASK");
    }
  }, []);

  return (
    <HomeLayout>
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        type="create"
        projectId={id}
      />

      <ProjectHeader setSearch={setSearch} searchValue={search} activeTab={activeTab} setActiveTab={setActiveTab}/>

      {activeTab == "Board" && <ViewBoardProject data={searchResult} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>}
      {activeTab == "List" && <ListProject data={searchResult} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>}
      {activeTab == "Table" && <TableProject data={searchResult} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>}
      {activeTab == "Timeline" && <TimelineProject data={searchResult} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>}

    </HomeLayout>
  )
}

export default Project