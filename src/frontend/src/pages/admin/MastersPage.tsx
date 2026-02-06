import RequireAdmin from '../../components/auth/RequireAdmin';
import FixedMasterCrud from '../../components/masters/FixedMasterCrud';
import MasterListEditor from '../../components/masters/MasterListEditor';
import {
  useGetDepartments,
  useGetCategories,
  useGetStatuses,
  useGetPriorities,
  useGetTaskTypes,
  useGetMasterLists,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateStatus,
  useUpdateStatus,
  useDeleteStatus,
  useCreatePriority,
  useUpdatePriority,
  useDeletePriority,
  useCreateTaskType,
  useUpdateTaskType,
  useDeleteTaskType,
  useCreateMasterList,
  useUpdateMasterList,
  useDeleteMasterList,
} from '../../hooks/masters/useMasters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MastersPage() {
  const { data: departments = [], isLoading: departmentsLoading } = useGetDepartments();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategories();
  const { data: statuses = [], isLoading: statusesLoading } = useGetStatuses();
  const { data: priorities = [], isLoading: prioritiesLoading } = useGetPriorities();
  const { data: taskTypes = [], isLoading: taskTypesLoading } = useGetTaskTypes();
  const { data: masterLists = [], isLoading: masterListsLoading } = useGetMasterLists();

  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const createStatus = useCreateStatus();
  const updateStatus = useUpdateStatus();
  const deleteStatus = useDeleteStatus();

  const createPriority = useCreatePriority();
  const updatePriority = useUpdatePriority();
  const deletePriority = useDeletePriority();

  const createTaskType = useCreateTaskType();
  const updateTaskType = useUpdateTaskType();
  const deleteTaskType = useDeleteTaskType();

  const createMasterList = useCreateMasterList();
  const updateMasterList = useUpdateMasterList();
  const deleteMasterList = useDeleteMasterList();

  return (
    <RequireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Master Data Management</h1>
          <p className="text-muted-foreground mt-2">Manage fixed masters and user-defined master lists</p>
        </div>

        <Tabs defaultValue="departments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="statuses">Statuses</TabsTrigger>
            <TabsTrigger value="priorities">Priorities</TabsTrigger>
            <TabsTrigger value="taskTypes">Task Types</TabsTrigger>
            <TabsTrigger value="masterLists">Master Lists</TabsTrigger>
          </TabsList>

          <TabsContent value="departments">
            <FixedMasterCrud
              title="Department"
              description="Manage organizational departments"
              items={departments}
              onCreate={(item) => createDepartment.mutateAsync(item)}
              onUpdate={(id, item) => updateDepartment.mutateAsync({ id, department: item })}
              onDelete={(id) => deleteDepartment.mutateAsync(id)}
              isLoading={departmentsLoading}
            />
          </TabsContent>

          <TabsContent value="categories">
            <FixedMasterCrud
              title="Category"
              description="Manage task categories"
              items={categories}
              onCreate={(item) => createCategory.mutateAsync(item)}
              onUpdate={(id, item) => updateCategory.mutateAsync({ id, category: item })}
              onDelete={(id) => deleteCategory.mutateAsync(id)}
              isLoading={categoriesLoading}
            />
          </TabsContent>

          <TabsContent value="statuses">
            <FixedMasterCrud
              title="Status"
              description="Manage task statuses"
              items={statuses}
              onCreate={(item) => createStatus.mutateAsync(item)}
              onUpdate={(id, item) => updateStatus.mutateAsync({ id, status: item })}
              onDelete={(id) => deleteStatus.mutateAsync(id)}
              isLoading={statusesLoading}
            />
          </TabsContent>

          <TabsContent value="priorities">
            <FixedMasterCrud
              title="Priority"
              description="Manage task priorities"
              items={priorities}
              onCreate={(item) => createPriority.mutateAsync(item)}
              onUpdate={(id, item) => updatePriority.mutateAsync({ id, priority: item })}
              onDelete={(id) => deletePriority.mutateAsync(id)}
              isLoading={prioritiesLoading}
            />
          </TabsContent>

          <TabsContent value="taskTypes">
            <FixedMasterCrud
              title="Task Type"
              description="Manage task types"
              items={taskTypes}
              onCreate={(item) => createTaskType.mutateAsync(item)}
              onUpdate={(id, item) => updateTaskType.mutateAsync({ id, taskType: item })}
              onDelete={(id) => deleteTaskType.mutateAsync(id)}
              isLoading={taskTypesLoading}
            />
          </TabsContent>

          <TabsContent value="masterLists">
            <MasterListEditor
              masterLists={masterLists}
              onCreate={(item) => createMasterList.mutateAsync(item)}
              onUpdate={(id, item) => updateMasterList.mutateAsync({ id, masterList: item })}
              onDelete={(id) => deleteMasterList.mutateAsync(id)}
              isLoading={masterListsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </RequireAdmin>
  );
}
