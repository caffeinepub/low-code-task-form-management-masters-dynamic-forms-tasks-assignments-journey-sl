import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import List "mo:core/List";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // COMPONENT CONFIGURATION
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // TYPES: User Profile
  public type UserProfile = {
    name : Text;
    department : ?Text;
    email : ?Text;
  };

  // TYPES: Master Data
  public type Department = {
    id : Text;
    name : Text;
    created : Int;
    lastUpdated : Int;
  };

  public type Category = {
    id : Text;
    name : Text;
    created : Int;
    lastUpdated : Int;
  };

  public type Status = {
    id : Text;
    name : Text;
    created : Int;
    lastUpdated : Int;
  };

  public type Priority = {
    id : Text;
    name : Text;
    created : Int;
    lastUpdated : Int;
  };

  public type TaskType = {
    id : Text;
    name : Text;
    created : Int;
    lastUpdated : Int;
  };

  public type MasterList = {
    id : Text;
    name : Text;
    items : [MasterListItem];
    created : Int;
    lastUpdated : Int;
  };

  public type MasterListItem = {
    value : Text;
    itemLabel : Text;
  };

  // TYPES: Form Management
  public type FormField = {
    id : Text;
    fieldLabel : Text;
    fieldType : FieldType;
    validations : ?ValidationRules;
    options : ?[FormFieldOption];
    masterListRef : ?Text;
  };

  public type FieldType = {
    #singleLine;
    #multiLine;
    #number;
    #date;
    #dateTime;
    #dropdown;
    #multiSelect;
    #fileUpload;
  };

  public type ValidationRules = {
    required : Bool;
    minLength : ?Nat;
    maxLength : ?Nat;
    minValue : ?Int;
    maxValue : ?Int;
  };

  public type FormFieldOption = {
    value : Text;
    fieldLabel : Text;
  };

  public type FormDefinition = {
    id : Text;
    version : Nat;
    name : Text;
    fields : [FormField];
    created : Int;
    lastUpdated : Int;
    creator : Principal;
  };

  public type DynamicFormInput = {
    formId : Text;
    version : Nat;
    data : [FormFieldInput];
    submittedBy : Principal;
    submittedAt : Int;
  };

  public type FormFieldInput = {
    fieldId : Text;
    value : FieldValue;
  };

  public type FieldValue = {
    #text : Text;
    #number : Int;
    #date : Int;
    #dateTime : Int;
    #file : Storage.ExternalBlob;
    #singleChoice : Text;
    #multipleChoices : [Text];
  };

  // TYPES: Task Management
  public type AssignmentType = {
    #department : Text;
    #user : Principal;
  };

  public type Task = {
    id : Text;
    taskType : Text;
    priority : Text;
    status : Text;
    owner : Principal;
    assignment : ?AssignmentType;
    createdDate : Int;
    dueDate : Int;
    completionDate : ?Int;
    attachedForms : [Text];
    formCompletionStatus : [(Text, Bool)];
  };

  public type TaskAuditEntry = {
    taskId : Text;
    timestamp : Int;
    user : Principal;
    action : TaskAction;
    details : Text;
  };

  public type TaskAction = {
    #created;
    #statusChanged;
    #assigned;
    #pickedUp;
    #reassigned;
    #formSubmitted;
    #escalated;
    #completed;
  };

  public type EscalationRule = {
    id : Text;
    taskType : Text;
    thresholdMinutes : Nat;
    action : Text;
  };

  public type TaskSLAStatus = {
    #onTrack;
    #atRisk;
    #breached;
  };

  // State Management
  let userProfiles = Map.empty<Principal, UserProfile>();
  let departments = Map.empty<Text, Department>();
  let categories = Map.empty<Text, Category>();
  let statuses = Map.empty<Text, Status>();
  let priorities = Map.empty<Text, Priority>();
  let taskTypes = Map.empty<Text, TaskType>();
  let masterLists = Map.empty<Text, MasterList>();
  let formDefinitions = Map.empty<Text, FormDefinition>();
  let tasks = Map.empty<Text, Task>();
  let formSubmissions = Map.empty<Text, DynamicFormInput>();
  let taskAuditLog = Map.empty<Text, [TaskAuditEntry]>();
  let escalationRules = Map.empty<Text, EscalationRule>();

  // USER PROFILE MANAGEMENT
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return null;
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return null;
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      return null;
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return;
    };
    userProfiles.add(caller, profile);
  };

  // MASTER DATA MANAGEMENT - ADMIN ONLY
  public shared ({ caller }) func createDepartment(department : Department) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    departments.add(department.id, department);
  };

  public shared ({ caller }) func updateDepartment(id : Text, department : Department) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    switch (departments.get(id)) {
      case (null) { () };
      case (?_) { departments.add(id, department) };
    };
  };

  public shared ({ caller }) func deleteDepartment(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    departments.remove(id);
  };

  public shared ({ caller }) func createCategory(category : Category) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    categories.add(category.id, category);
  };

  public shared ({ caller }) func updateCategory(id : Text, category : Category) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    switch (categories.get(id)) {
      case (null) { () };
      case (?_) { categories.add(id, category) };
    };
  };

  public shared ({ caller }) func deleteCategory(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    categories.remove(id);
  };

  public shared ({ caller }) func createStatus(status : Status) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    statuses.add(status.id, status);
  };

  public shared ({ caller }) func updateStatus(id : Text, status : Status) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    switch (statuses.get(id)) {
      case (null) { () };
      case (?_) { statuses.add(id, status) };
    };
  };

  public shared ({ caller }) func deleteStatus(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    statuses.remove(id);
  };

  public shared ({ caller }) func createPriority(priority : Priority) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    priorities.add(priority.id, priority);
  };

  public shared ({ caller }) func updatePriority(id : Text, priority : Priority) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    switch (priorities.get(id)) {
      case (null) { () };
      case (?_) { priorities.add(id, priority) };
    };
  };

  public shared ({ caller }) func deletePriority(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    priorities.remove(id);
  };

  public shared ({ caller }) func createTaskType(taskType : TaskType) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    taskTypes.add(taskType.id, taskType);
  };

  public shared ({ caller }) func updateTaskType(id : Text, taskType : TaskType) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    switch (taskTypes.get(id)) {
      case (null) { () };
      case (?_) { taskTypes.add(id, taskType) };
    };
  };

  public shared ({ caller }) func deleteTaskType(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    taskTypes.remove(id);
  };

  // MASTER LIST MANAGEMENT - ADMIN ONLY
  public shared ({ caller }) func createMasterList(masterList : MasterList) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    masterLists.add(masterList.id, masterList);
  };

  public shared ({ caller }) func updateMasterList(id : Text, masterList : MasterList) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    switch (masterLists.get(id)) {
      case (null) { () };
      case (?_) { masterLists.add(id, masterList) };
    };
  };

  public shared ({ caller }) func deleteMasterList(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    masterLists.remove(id);
  };

  // FORM DEFINITION MANAGEMENT - ADMIN ONLY
  public shared ({ caller }) func createFormDefinition(formDefinition : FormDefinition) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    formDefinitions.add(formDefinition.id, formDefinition);
  };

  public shared ({ caller }) func updateFormDefinition(id : Text, formDefinition : FormDefinition) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    switch (formDefinitions.get(id)) {
      case (null) { () };
      case (?_) { formDefinitions.add(id, formDefinition) };
    };
  };

  public shared ({ caller }) func deleteFormDefinition(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    formDefinitions.remove(id);
  };

  // ESCALATION RULES - ADMIN ONLY
  public shared ({ caller }) func createEscalationRule(rule : EscalationRule) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    escalationRules.add(rule.id, rule);
  };

  public shared ({ caller }) func updateEscalationRule(id : Text, rule : EscalationRule) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    switch (escalationRules.get(id)) {
      case (null) { () };
      case (?_) { escalationRules.add(id, rule) };
    };
  };

  public shared ({ caller }) func deleteEscalationRule(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) { return };
    escalationRules.remove(id);
  };
};
