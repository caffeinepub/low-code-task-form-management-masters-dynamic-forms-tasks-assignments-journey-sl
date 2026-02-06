import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface FormFieldInput {
    value: FieldValue;
    fieldId: string;
}
export interface Category {
    id: string;
    created: bigint;
    name: string;
    lastUpdated: bigint;
}
export interface Priority {
    id: string;
    created: bigint;
    name: string;
    lastUpdated: bigint;
}
export interface FormField {
    id: string;
    masterListRef?: string;
    fieldLabel: string;
    validations?: ValidationRules;
    options?: Array<FormFieldOption>;
    fieldType: FieldType;
}
export type FieldValue = {
    __kind__: "date";
    date: bigint;
} | {
    __kind__: "file";
    file: ExternalBlob;
} | {
    __kind__: "text";
    text: string;
} | {
    __kind__: "singleChoice";
    singleChoice: string;
} | {
    __kind__: "number";
    number: bigint;
} | {
    __kind__: "multipleChoices";
    multipleChoices: Array<string>;
} | {
    __kind__: "dateTime";
    dateTime: bigint;
};
export interface Task {
    id: string;
    status: string;
    completionDate?: bigint;
    assignment?: AssignmentType;
    owner: Principal;
    attachedForms: Array<TaskFormAttachment>;
    createdDate: bigint;
    dueDate: bigint;
    taskType: string;
    priority: string;
}
export interface MasterListItem {
    value: string;
    itemLabel: string;
}
export interface TaskAuditEntry {
    action: TaskAction;
    user: Principal;
    taskId: string;
    timestamp: bigint;
    details: string;
}
export interface TaskFormAttachment {
    completed: boolean;
    formDefinitionId: string;
}
export interface TaskType {
    id: string;
    created: bigint;
    name: string;
    lastUpdated: bigint;
}
export interface ValidationRules {
    minValue?: bigint;
    required: boolean;
    maxLength?: bigint;
    maxValue?: bigint;
    minLength?: bigint;
}
export interface MasterList {
    id: string;
    created: bigint;
    name: string;
    lastUpdated: bigint;
    items: Array<MasterListItem>;
}
export interface DynamicFormInput {
    data: Array<FormFieldInput>;
    submittedAt: bigint;
    submittedBy: Principal;
    version: bigint;
    formId: string;
}
export interface Department {
    id: string;
    created: bigint;
    name: string;
    lastUpdated: bigint;
}
export type AssignmentType = {
    __kind__: "user";
    user: Principal;
} | {
    __kind__: "department";
    department: string;
};
export interface FormFieldOption {
    value: string;
    fieldLabel: string;
}
export interface FormDefinition {
    id: string;
    created: bigint;
    creator: Principal;
    name: string;
    lastUpdated: bigint;
    version: bigint;
    fields: Array<FormField>;
}
export interface Status {
    id: string;
    created: bigint;
    name: string;
    lastUpdated: bigint;
}
export interface EscalationRule {
    id: string;
    action: string;
    taskType: string;
    thresholdMinutes: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
    department?: string;
}
export enum FieldType {
    date = "date",
    multiSelect = "multiSelect",
    fileUpload = "fileUpload",
    multiLine = "multiLine",
    number_ = "number",
    singleLine = "singleLine",
    dateTime = "dateTime",
    dropdown = "dropdown"
}
export enum TaskAction {
    assigned = "assigned",
    created = "created",
    escalated = "escalated",
    completed = "completed",
    formSubmitted = "formSubmitted",
    pickedUp = "pickedUp",
    statusChanged = "statusChanged",
    reassigned = "reassigned"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignTask(taskId: string, assignment: AssignmentType): Promise<void>;
    createCategory(category: Category): Promise<void>;
    createDepartment(department: Department): Promise<void>;
    createEscalationRule(rule: EscalationRule): Promise<void>;
    createFormDefinition(formDefinition: FormDefinition): Promise<void>;
    createMasterList(masterList: MasterList): Promise<void>;
    createPriority(priority: Priority): Promise<void>;
    createStatus(status: Status): Promise<void>;
    createTask(task: Task): Promise<void>;
    createTaskType(taskType: TaskType): Promise<void>;
    deleteCategory(id: string): Promise<void>;
    deleteDepartment(id: string): Promise<void>;
    deleteEscalationRule(id: string): Promise<void>;
    deleteFormDefinition(id: string): Promise<void>;
    deleteMasterList(id: string): Promise<void>;
    deletePriority(id: string): Promise<void>;
    deleteStatus(id: string): Promise<void>;
    deleteTaskType(id: string): Promise<void>;
    getAllFormSubmissions(): Promise<Array<DynamicFormInput>>;
    getAllTasks(): Promise<Array<Task>>;
    getAssignedTasks(): Promise<Array<Task>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getCategory(id: string): Promise<Category | null>;
    getDepartment(id: string): Promise<Department | null>;
    getDepartments(): Promise<Array<Department>>;
    getEscalationRule(id: string): Promise<EscalationRule | null>;
    getEscalationRules(): Promise<Array<EscalationRule>>;
    getFormDefinition(id: string): Promise<FormDefinition | null>;
    getFormDefinitions(): Promise<Array<FormDefinition>>;
    getFormSubmission(submissionId: string): Promise<DynamicFormInput | null>;
    getMasterList(id: string): Promise<MasterList | null>;
    getMasterLists(): Promise<Array<MasterList>>;
    getMyFormSubmissions(): Promise<Array<DynamicFormInput>>;
    getMyTasks(): Promise<Array<Task>>;
    getPriorities(): Promise<Array<Priority>>;
    getPriority(id: string): Promise<Priority | null>;
    getStatus(id: string): Promise<Status | null>;
    getStatuses(): Promise<Array<Status>>;
    getTask(id: string): Promise<Task | null>;
    getTaskAuditLog(taskId: string): Promise<Array<TaskAuditEntry>>;
    getTaskType(id: string): Promise<TaskType | null>;
    getTaskTypes(): Promise<Array<TaskType>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitForm(submission: DynamicFormInput): Promise<string>;
    submitTaskForm(taskId: string, formSubmission: DynamicFormInput): Promise<void>;
    updateCategory(id: string, category: Category): Promise<void>;
    updateDepartment(id: string, department: Department): Promise<void>;
    updateEscalationRule(id: string, rule: EscalationRule): Promise<void>;
    updateFormDefinition(id: string, formDefinition: FormDefinition): Promise<void>;
    updateMasterList(id: string, masterList: MasterList): Promise<void>;
    updatePriority(id: string, priority: Priority): Promise<void>;
    updateStatus(id: string, status: Status): Promise<void>;
    updateTask(id: string, task: Task): Promise<void>;
    updateTaskType(id: string, taskType: TaskType): Promise<void>;
}
