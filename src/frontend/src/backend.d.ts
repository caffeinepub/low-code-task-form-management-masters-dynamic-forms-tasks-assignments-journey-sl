import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface MasterListItem {
    value: string;
    itemLabel: string;
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
export interface Department {
    id: string;
    created: bigint;
    name: string;
    lastUpdated: bigint;
}
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCategory(category: Category): Promise<void>;
    createDepartment(department: Department): Promise<void>;
    createEscalationRule(rule: EscalationRule): Promise<void>;
    createFormDefinition(formDefinition: FormDefinition): Promise<void>;
    createMasterList(masterList: MasterList): Promise<void>;
    createPriority(priority: Priority): Promise<void>;
    createStatus(status: Status): Promise<void>;
    createTaskType(taskType: TaskType): Promise<void>;
    deleteCategory(id: string): Promise<void>;
    deleteDepartment(id: string): Promise<void>;
    deleteEscalationRule(id: string): Promise<void>;
    deleteFormDefinition(id: string): Promise<void>;
    deleteMasterList(id: string): Promise<void>;
    deletePriority(id: string): Promise<void>;
    deleteStatus(id: string): Promise<void>;
    deleteTaskType(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCategory(id: string, category: Category): Promise<void>;
    updateDepartment(id: string, department: Department): Promise<void>;
    updateEscalationRule(id: string, rule: EscalationRule): Promise<void>;
    updateFormDefinition(id: string, formDefinition: FormDefinition): Promise<void>;
    updateMasterList(id: string, masterList: MasterList): Promise<void>;
    updatePriority(id: string, priority: Priority): Promise<void>;
    updateStatus(id: string, status: Status): Promise<void>;
    updateTaskType(id: string, taskType: TaskType): Promise<void>;
}
