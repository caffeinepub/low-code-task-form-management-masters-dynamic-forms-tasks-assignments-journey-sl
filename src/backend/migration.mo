import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type Tasks = Map.Map<Text, { id : Text; taskType : Text; priority : Text; status : Text; owner : Principal; assignment : ?{ #department : Text; #user : Principal }; createdDate : Int; dueDate : Int; completionDate : ?Int; attachedForms : [Text]; formCompletionStatus : [(Text, Bool)] }>;

  public type OldActor = {
    tasks : Tasks;
  };

  type Task = {
    id : Text;
    taskType : Text;
    priority : Text;
    status : Text;
    owner : Principal;
    assignment : ?{ #department : Text; #user : Principal };
    createdDate : Int;
    dueDate : Int;
    completionDate : ?Int;
    attachedForms : [TaskFormAttachment];
  };

  type TaskFormAttachment = {
    formDefinitionId : Text;
    completed : Bool;
  };

  type NewTasks = Map.Map<Text, Task>;

  public type NewActor = {
    tasks : NewTasks;
  };

  public func run(old : OldActor) : NewActor {
    let newTasks = old.tasks.map<Text, { id : Text; taskType : Text; priority : Text; status : Text; owner : Principal; assignment : ?{ #department : Text; #user : Principal }; createdDate : Int; dueDate : Int; completionDate : ?Int; attachedForms : [Text]; formCompletionStatus : [(Text, Bool)] }, Task>(
      func(_id, oldTask) {
        {
          id = oldTask.id;
          taskType = oldTask.taskType;
          priority = oldTask.priority;
          status = oldTask.status;
          owner = oldTask.owner;
          assignment = oldTask.assignment;
          createdDate = oldTask.createdDate;
          dueDate = oldTask.dueDate;
          completionDate = oldTask.completionDate;
          attachedForms = arrayToTaskFormAttachments(oldTask.attachedForms);
        };
      }
    );
    { tasks = newTasks };
  };

  func arrayToTaskFormAttachments(arr : [Text]) : [TaskFormAttachment] {
    arr.map<Text, TaskFormAttachment>(
      func(formId) {
        {
          formDefinitionId = formId;
          completed = false;
        };
      }
    );
  };
};
