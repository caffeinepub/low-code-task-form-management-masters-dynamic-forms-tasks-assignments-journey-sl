import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
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
    attachedForms : [TaskFormAttachment];
  };

  public type TaskFormAttachment = {
    formDefinitionId : Text;
    completed : Bool;
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
      Runtime.trap("Unauthorized: Only users can access caller profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // MASTER DATA MANAGEMENT - ADMIN ONLY (CREATE/UPDATE/DELETE)
  public shared ({ caller }) func createDepartment(department : Department) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can create departments");
    };
    departments.add(department.id, department);
  };

  public shared ({ caller }) func updateDepartment(id : Text, department : Department) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update departments");
    };
    switch (departments.get(id)) {
      case (null) { () };
      case (?_) { departments.add(id, department) };
    };
  };

  public shared ({ caller }) func deleteDepartment(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete departments");
    };
    departments.remove(id);
  };

  public query ({ caller }) func getDepartments() : async [Department] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view departments");
    };
    departments.values().toArray();
  };

  public query ({ caller }) func getDepartment(id : Text) : async ?Department {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view departments");
    };
    departments.get(id);
  };

  public shared ({ caller }) func createCategory(category : Category) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can create categories");
    };
    categories.add(category.id, category);
  };

  public shared ({ caller }) func updateCategory(id : Text, category : Category) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update categories");
    };
    switch (categories.get(id)) {
      case (null) { () };
      case (?_) { categories.add(id, category) };
    };
  };

  public shared ({ caller }) func deleteCategory(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete categories");
    };
    categories.remove(id);
  };

  public query ({ caller }) func getCategories() : async [Category] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view categories");
    };
    categories.values().toArray();
  };

  public query ({ caller }) func getCategory(id : Text) : async ?Category {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view categories");
    };
    categories.get(id);
  };

  public shared ({ caller }) func createStatus(status : Status) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can create status");
    };
    statuses.add(status.id, status);
  };

  public shared ({ caller }) func updateStatus(id : Text, status : Status) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update status");
    };
    switch (statuses.get(id)) {
      case (null) { () };
      case (?_) { statuses.add(id, status) };
    };
  };

  public shared ({ caller }) func deleteStatus(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete status");
    };
    statuses.remove(id);
  };

  public query ({ caller }) func getStatuses() : async [Status] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view statuses");
    };
    statuses.values().toArray();
  };

  public query ({ caller }) func getStatus(id : Text) : async ?Status {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view statuses");
    };
    statuses.get(id);
  };

  public shared ({ caller }) func createPriority(priority : Priority) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can create priority");
    };
    priorities.add(priority.id, priority);
  };

  public shared ({ caller }) func updatePriority(id : Text, priority : Priority) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update priorities");
    };
    switch (priorities.get(id)) {
      case (null) { () };
      case (?_) { priorities.add(id, priority) };
    };
  };

  public shared ({ caller }) func deletePriority(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete priorities");
    };
    priorities.remove(id);
  };

  public query ({ caller }) func getPriorities() : async [Priority] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view priorities");
    };
    priorities.values().toArray();
  };

  public query ({ caller }) func getPriority(id : Text) : async ?Priority {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view priorities");
    };
    priorities.get(id);
  };

  public shared ({ caller }) func createTaskType(taskType : TaskType) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can create task types");
    };
    taskTypes.add(taskType.id, taskType);
  };

  public shared ({ caller }) func updateTaskType(id : Text, taskType : TaskType) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update task types");
    };
    switch (taskTypes.get(id)) {
      case (null) { () };
      case (?_) { taskTypes.add(id, taskType) };
    };
  };

  public shared ({ caller }) func deleteTaskType(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete task types");
    };
    taskTypes.remove(id);
  };

  public query ({ caller }) func getTaskTypes() : async [TaskType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view task types");
    };
    taskTypes.values().toArray();
  };

  public query ({ caller }) func getTaskType(id : Text) : async ?TaskType {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view task types");
    };
    taskTypes.get(id);
  };

  // MASTER LIST MANAGEMENT - ADMIN ONLY (CREATE/UPDATE/DELETE)
  public shared ({ caller }) func createMasterList(masterList : MasterList) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can create master lists");
    };
    masterLists.add(masterList.id, masterList);
  };

  public shared ({ caller }) func updateMasterList(id : Text, masterList : MasterList) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update master lists");
    };
    switch (masterLists.get(id)) {
      case (null) { () };
      case (?_) { masterLists.add(id, masterList) };
    };
  };

  public shared ({ caller }) func deleteMasterList(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete master lists");
    };
    masterLists.remove(id);
  };

  public query ({ caller }) func getMasterLists() : async [MasterList] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view master lists");
    };
    masterLists.values().toArray();
  };

  public query ({ caller }) func getMasterList(id : Text) : async ?MasterList {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view master lists");
    };
    masterLists.get(id);
  };

  // FORM DEFINITION MANAGEMENT - ADMIN ONLY (CREATE/UPDATE/DELETE)
  public shared ({ caller }) func createFormDefinition(formDefinition : FormDefinition) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can create form definitions");
    };
    formDefinitions.add(formDefinition.id, formDefinition);
  };

  public shared ({ caller }) func updateFormDefinition(id : Text, formDefinition : FormDefinition) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can modify form definitions");
    };
    switch (formDefinitions.get(id)) {
      case (null) { () };
      case (?_) { formDefinitions.add(id, formDefinition) };
    };
  };

  public shared ({ caller }) func deleteFormDefinition(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete form definitions");
    };
    formDefinitions.remove(id);
  };

  public query ({ caller }) func getFormDefinitions() : async [FormDefinition] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view form definitions");
    };
    formDefinitions.values().toArray();
  };

  public query ({ caller }) func getFormDefinition(id : Text) : async ?FormDefinition {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view form definitions");
    };
    formDefinitions.get(id);
  };

  // FORM SUBMISSION - USER LEVEL
  public shared ({ caller }) func submitForm(submission : DynamicFormInput) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit forms");
    };
    let submissionId = submission.formId.concat("-".concat(Int.toText(submission.submittedAt)));
    formSubmissions.add(submissionId, submission);
    submissionId;
  };

  public query ({ caller }) func getFormSubmission(submissionId : Text) : async ?DynamicFormInput {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view form submissions");
    };
    switch (formSubmissions.get(submissionId)) {
      case (null) { null };
      case (?submission) {
        if (submission.submittedBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own submissions");
        };
        ?submission;
      };
    };
  };

  public query ({ caller }) func getMyFormSubmissions() : async [DynamicFormInput] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view form submissions");
    };
    let allSubmissions = formSubmissions.values().toArray();
    allSubmissions.filter<DynamicFormInput>(func(s) { s.submittedBy == caller });
  };

  public query ({ caller }) func getAllFormSubmissions() : async [DynamicFormInput] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view all form submissions");
    };
    formSubmissions.values().toArray();
  };

  // TASK MANAGEMENT - USER LEVEL
  public shared ({ caller }) func createTask(task : Task) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tasks");
    };

    // Validate that at least one form is attached
    if (task.attachedForms.size() == 0) {
      Runtime.trap("Task must have at least one attached form definition");
    };

    // Validate that all attached forms exist and are not already completed
    let validatedForms = task.attachedForms.map(
      func(formAttachment) {
        switch (formDefinitions.get(formAttachment.formDefinitionId)) {
          case (null) { Runtime.trap("Form definition not found: " # formAttachment.formDefinitionId) };
          case (?_) { { formAttachment with completed = false } };
        };
      }
    );

    // Assign validated forms to task and mark as incomplete
    let finalTask = {
      task with
      attachedForms = validatedForms
    };

    tasks.add(task.id, finalTask);
    let auditEntry : TaskAuditEntry = {
      taskId = task.id;
      timestamp = Time.now();
      user = caller;
      action = #created;
      details = "Task created";
    };
    addAuditEntry(task.id, auditEntry);
  };

  public shared ({ caller }) func submitTaskForm(taskId : Text, formSubmission : DynamicFormInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit task forms");
    };

    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        // Authorization: Check if caller is owner, assigned user, or admin
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        let isOwner = task.owner == caller;
        
        let isAssigned = switch (task.assignment) {
          case (null) { false };
          case (?assignment) {
            switch (assignment) {
              case (#user(u)) { u == caller };
              case (#department(d)) {
                switch (userProfiles.get(caller)) {
                  case (null) { false };
                  case (?profile) {
                    switch (profile.department) {
                      case (null) { false };
                      case (?dept) { dept == d };
                    };
                  };
                };
              };
            };
          };
        };

        if (not isOwner and not isAssigned and not isAdmin) {
          Runtime.trap("Unauthorized: Can only submit forms for tasks you own or are assigned to");
        };

        // Store the form submission
        let submissionId = formSubmission.formId.concat("-".concat(Int.toText(formSubmission.submittedAt)));
        formSubmissions.add(submissionId, formSubmission);

        // Validate that the form is attached to the task
        let attachedFormIndex = task.attachedForms.findIndex(
          func(form) { form.formDefinitionId == formSubmission.formId }
        );

        switch (attachedFormIndex) {
          case (null) { Runtime.trap("Form not attached to task: " # formSubmission.formId) };
          case (?idx) {
            // Check if the form is already completed
            if (task.attachedForms[idx].completed) {
              Runtime.trap("Form entry already completed for this task");
            };

            // Mark the form as completed
            let updatedAttachedForms = task.attachedForms.map(
              func(form) {
                if (task.attachedForms.size() > idx and task.attachedForms[idx].formDefinitionId == form.formDefinitionId) {
                  { form with completed = true };
                } else { form };
              }
            );

            // Update the task with the completed status
            let updatedTask = {
              task with attachedForms = updatedAttachedForms
            };

            // Persist the updated task
            tasks.add(taskId, updatedTask);

            // Log this event in the task's audit log
            let auditEntry : TaskAuditEntry = {
              taskId = taskId;
              timestamp = Time.now();
              user = caller;
              action = #formSubmitted;
              details = "Form submission completed for formId: " # formSubmission.formId;
            };
            addAuditEntry(taskId, auditEntry);
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateTask(id : Text, task : Task) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update tasks");
    };
    switch (tasks.get(id)) {
      case (null) { Runtime.trap("Task not found") };
      case (?existingTask) {
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        let isOwner = existingTask.owner == caller;

        // Check if caller is assigned to the task
        let isAssigned = switch (existingTask.assignment) {
          case (null) { false };
          case (?assignment) {
            switch (assignment) {
              case (#user(u)) { u == caller };
              case (#department(d)) {
                switch (userProfiles.get(caller)) {
                  case (null) { false };
                  case (?profile) {
                    switch (profile.department) {
                      case (null) { false };
                      case (?dept) { dept == d };
                    };
                  };
                };
              };
            };
          };
        };

        if (not isOwner and not isAssigned and not isAdmin) {
          Runtime.trap("Unauthorized: Can only update tasks you own or are assigned to");
        };

        // Non-admins cannot change the owner field
        if (not isAdmin and existingTask.owner != task.owner) {
          Runtime.trap("Unauthorized: Only admins can change task ownership");
        };

        // Non-admins and non-owners cannot modify attachedForms
        if (not isAdmin and not isOwner and existingTask.attachedForms != task.attachedForms) {
          Runtime.trap("Unauthorized: Only task owners or admins can modify attached forms");
        };

        tasks.add(id, task);
        let auditEntry : TaskAuditEntry = {
          taskId = id;
          timestamp = Time.now();
          user = caller;
          action = #statusChanged;
          details = "Task updated";
        };
        addAuditEntry(id, auditEntry);
      };
    };
  };

  public shared ({ caller }) func assignTask(taskId : Text, assignment : AssignmentType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can assign tasks");
    };
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        let isOwner = task.owner == caller;

        if (not isOwner and not isAdmin) {
          Runtime.trap("Unauthorized: Can only assign your own tasks");
        };

        let updatedTask = {
          task with assignment = ?assignment
        };
        tasks.add(taskId, updatedTask);
        let auditEntry : TaskAuditEntry = {
          taskId = taskId;
          timestamp = Time.now();
          user = caller;
          action = #assigned;
          details = "Task assigned";
        };
        addAuditEntry(taskId, auditEntry);
      };
    };
  };

  public query ({ caller }) func getTask(id : Text) : async ?Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    tasks.get(id);
  };

  public query ({ caller }) func getMyTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    let allTasks = tasks.values().toArray();
    allTasks.filter<Task>(func(t) { t.owner == caller });
  };

  public query ({ caller }) func getAssignedTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    let allTasks = tasks.values().toArray();
    allTasks.filter<Task>(func(t) {
      switch (t.assignment) {
        case (null) { false };
        case (?assignment) {
          switch (assignment) {
            case (#user(u)) { u == caller };
            case (#department(d)) {
              switch (userProfiles.get(caller)) {
                case (null) { false };
                case (?profile) {
                  switch (profile.department) {
                    case (null) { false };
                    case (?dept) { dept == d };
                  };
                };
              };
            };
          };
        };
      };
    });
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view all tasks");
    };
    tasks.values().toArray();
  };

  public query ({ caller }) func getTaskAuditLog(taskId : Text) : async [TaskAuditEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view audit logs");
    };
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        let isOwner = task.owner == caller;

        // Check if user is assigned to the task
        let isAssigned = switch (task.assignment) {
          case (null) { false };
          case (?assignment) {
            switch (assignment) {
              case (#user(u)) { u == caller };
              case (#department(d)) {
                switch (userProfiles.get(caller)) {
                  case (null) { false };
                  case (?profile) {
                    switch (profile.department) {
                      case (null) { false };
                      case (?dept) { dept == d };
                    };
                  };
                };
              };
            };
          };
        };

        if (not isOwner and not isAssigned and not isAdmin) {
          Runtime.trap("Unauthorized: Can only view audit log for your own or assigned tasks");
        };

        switch (taskAuditLog.get(taskId)) {
          case (null) { [] };
          case (?log) { log };
        };
      };
    };
  };

  // ESCALATION RULES - ADMIN ONLY (CREATE/UPDATE/DELETE)
  public shared ({ caller }) func createEscalationRule(rule : EscalationRule) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can create escalation rules");
    };
    escalationRules.add(rule.id, rule);
  };

  public shared ({ caller }) func updateEscalationRule(id : Text, rule : EscalationRule) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can modify escalation rules");
    };
    switch (escalationRules.get(id)) {
      case (null) { () };
      case (?_) { escalationRules.add(id, rule) };
    };
  };

  public shared ({ caller }) func deleteEscalationRule(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete escalation rules");
    };
    escalationRules.remove(id);
  };

  public query ({ caller }) func getEscalationRules() : async [EscalationRule] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view escalation rules");
    };
    escalationRules.values().toArray();
  };

  public query ({ caller }) func getEscalationRule(id : Text) : async ?EscalationRule {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view escalation rules");
    };
    escalationRules.get(id);
  };

  // HELPER FUNCTIONS
  private func addAuditEntry(taskId : Text, entry : TaskAuditEntry) {
    switch (taskAuditLog.get(taskId)) {
      case (null) {
        taskAuditLog.add(taskId, [entry]);
      };
      case (?existingLog) {
        let updatedLog = existingLog.concat([entry]);
        taskAuditLog.add(taskId, updatedLog);
      };
    };
  };
};
