import { useQuery } from '@tanstack/react-query';
import { projectsApi, tasksApi } from '../lib/api';
import { Link } from 'react-router-dom';
import { FolderKanban, CheckSquare, Clock } from 'lucide-react';

export function DashboardPage() {
  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list(),
  });

  const { data: tasksData } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksApi.list(),
  });

  const projects = projectsData?.data?.projects || [];
  const tasks = tasksData?.data?.tasks || [];

  const activeTasks = tasks.filter((t: any) => t.status !== 'done');
  const recentProjects = projects.slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Projects"
          value={projects.length}
          icon={<FolderKanban className="text-primary-600" />}
        />
        <StatCard
          title="Active Tasks"
          value={activeTasks.length}
          icon={<CheckSquare className="text-green-600" />}
        />
        <StatCard
          title="In Progress"
          value={tasks.filter((t: any) => t.status === 'in_progress').length}
          icon={<Clock className="text-orange-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
          <div className="space-y-3">
            {recentProjects.map((project: any) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-200"
              >
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-500">{project.description}</p>
              </Link>
            ))}
          </div>
          <Link
            to="/projects"
            className="mt-4 block text-center text-primary-600 hover:text-primary-700 font-medium"
          >
            View all projects →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Active Tasks</h2>
          <div className="space-y-3">
            {activeTasks.slice(0, 5).map((task: any) => (
              <div
                key={task.id}
                className="p-3 rounded-lg border border-gray-200"
              >
                <h3 className="font-medium">{task.title}</h3>
                <div className="flex items-center mt-2 space-x-2">
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/tasks"
            className="mt-4 block text-center text-primary-600 hover:text-primary-700 font-medium"
          >
            View all tasks →
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    review: 'bg-yellow-100 text-yellow-800',
    done: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
}
