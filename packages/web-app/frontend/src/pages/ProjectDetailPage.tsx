import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi, tasksApi } from '../lib/api';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: projectData } = useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.get(id!),
  });

  const { data: tasksData } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksApi.list(id!),
  });

  const project = projectData?.data?.project;
  const tasks = tasksData?.data?.tasks || [];

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
        <p className="text-gray-600">{project.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <div className="space-y-3">
          {tasks.map((task: any) => (
            <div key={task.id} className="p-4 border rounded-lg">
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              <div className="flex items-center mt-3 space-x-2">
                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                  {task.status}
                </span>
                <span className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-800">
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
