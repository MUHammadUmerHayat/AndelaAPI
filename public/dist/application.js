'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'mean';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'angularFileUpload',
        'Mac'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName) {
      // Create angular module
      angular.module(moduleName, []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('admin');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('applicant-test');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('applicant');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('instructors');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
//Setting up route
angular.module('admin').config([
  '$stateProvider',
  function ($stateProvider) {
    // Lists state routes
    $stateProvider.state('signInUser', {
      url: '/admin',
      templateUrl: 'modules/admin/views/admin.signin.view.html'
    }).state('createUser', {
      url: '/admin/create',
      templateUrl: 'modules/admin/views/admin.create.users.html'
    }).state('createInst', {
      url: '/admin/createInst',
      templateUrl: 'modules/admin/views/admin.create.inst.html'
    }).state('adminWelcome', {
      url: '/admin/welcome',
      templateUrl: 'modules/admin/views/admin.welcome.html'
    }).state('listAppts', {
      url: '/admin/appts',
      templateUrl: 'modules/admin/views/list.applicants.admin.html'
    }).state('listInstrs', {
      url: '/admin/instrs',
      templateUrl: 'modules/admin/views/list.instructors.admin.html'
    }).state('viewcamp', {
      url: '/admin/camps/:campId',
      templateUrl: 'modules/admin/views/view.bootcamp.admin.html'
    }).state('viewAppt', {
      url: '/admin/appt/:apptId',
      templateUrl: 'modules/admin/views/view.applicant.admin.html'
    }).state('editApplicant', {
      url: '/admin/appt/:apptId',
      templateUrl: 'modules/admin/views/edit.applicant.admin.html'
    }).state('listTrainees', {
      url: '/admin/trainees',
      templateUrl: 'modules/admin/views/list.trainees.admin.html'
    }).state('listFellows', {
      url: '/admin/fellows',
      templateUrl: 'modules/admin/views/list.fellows.admin.html'
    }).state('rateFellow', {
      url: '/fellows/:apptId/rate',
      templateUrl: 'modules/admin/views/rate.fellows.admin.html'
    }).state('createTest', {
      url: '/admin/test/create',
      templateUrl: 'modules/admin/views/admin.create.test.html'
    }).state('listcamps', {
      url: '/admin/camps',
      templateUrl: 'modules/admin/views/list.bootcamps.admin.html'
    }).state('listadmins', {
      url: '/admins',
      templateUrl: 'modules/admin/views/list.admins.admin.html'
    }).state('viewTest', {
      url: '/admin/test',
      templateUrl: 'modules/admin/views/view.tests.admin.html'
    }).state('createCamp', {
      url: '/admin/create/camp',
      templateUrl: 'modules/admin/views/admin.create.camp.html'
    }).state('editTest', {
      url: '/admin/test/:testId',
      templateUrl: 'modules/admin/views/view.test.admin.html'
    }).state('addQueTest', {
      url: '/admin/test/add/:testId',
      templateUrl: 'modules/admin/views/admin.add-question.test.html'
    }).state('listSkills', {
      url: '/admin/skills',
      templateUrl: 'modules/admin/views/list.skills.admin.html'
    });
  }
]);'use strict';
// Lists controller
angular.module('admin').controller('BootcampsController', [
  '$scope',
  '$http',
  'Authentication',
  '$stateParams',
  '$location',
  '$modal',
  '$log',
  'Bootcamp',
  function ($scope, $http, Authentication, $stateParams, $location, $modal, $log, Bootcamp) {
    $scope.user = Authentication.user;
    // Create Bootcamp
    $scope.createCamp = function () {
      var bootcamp = new Bootcamp($scope.credentials);
      bootcamp.$save(function success(response) {
        $location.path('/admin/camps');
      }, function (error) {
        if (error) {
          $scope.error = 'Something went wrong. Please try again and check your input';
        }
      });
    };
    // View a particular Bootcamp
    $scope.viewcamp = function () {
      Bootcamp.get({ campId: $stateParams.campId }, function success(response) {
        $scope.camp = response;
        $scope.editorEnabled = false;
      }, function (error) {
        $scope.error = error.message;
      });
    };
    // List all Bootcamps
    $scope.listcamps = function () {
      Bootcamp.query(function success(response) {
        $scope.camps = response;
        for (var i = 0; i < response.length; i++) {
          $scope.camp_options.push(response[i].camp_name);
        }
      }, function (error) {
        $scope.error = error.data.message;
        $location.path('/admin/welcome');
      });
    };
    $scope.deleteCamp = function (camp, index) {
      $scope.camps.splice(index, 1);
      camp.$remove(function success(response) {
      }, function (error) {
        $scope.error = error.data.message;
      });
    };
    $scope.enableApplicantEditor = function (index) {
      $scope.editorEnabled = true;
      $scope.formData.editableFirstName = $scope.camp.applicants[index].firstName;
      $scope.formData.editableLastName = $scope.camp.applicants[index].lastName;
      $scope.formData.editableEmail = $scope.camp.applicants[index].email;
    };
    $scope.disableApplicantEditor = function () {
      $scope.editorEnabled = false;
    };
    $scope.saveApplicant = function (index) {
      $scope.camp.applicants[index].firstName = $scope.formData.editableFirstName;
      $scope.camp.applicants[index].lastName = $scope.formData.editableLastName;
      $scope.camp.applicants[index].email = $scope.formData.editableEmail;
      var url = 'users/' + $scope.camp.applicants[index]._id;
      var data = {
          firstName: $scope.formData.editableFirstName,
          lastName: $scope.formData.editableLastName,
          email: $scope.formData.editableEmail
        };
      $http.put(url, data).success(function (response) {
      }).error(function (response) {
        $scope.error = response.message;
      });
      $scope.disableApplicantEditor();
    };
    $scope.changeApplicantStatusInline = function (apptId, index) {
      if ($scope.data.status.name === 'fellow') {
        $http.put('/admin/applicant/' + apptId + '/role', { role: 'fellow' }).success(function (response) {
          // If successful show success message and clear form
          $scope.camp.applicants[index].status.name = 'Andela Fellow';
        }).error(function (response) {
          $scope.error = response.message;
        });
      } else {
        $http.put('/admin/applicant/' + apptId + '/status', $scope.data).success(function (response) {
          // If successful show success message and clear form
          $scope.camp.applicants[index].status.name = $scope.data.status.name;
          $scope.camp.applicants[index].status.reason = $scope.data.status.reason;
          $scope.data.status.name = '';
        }).error(function (response) {
          $scope.error = response.message;
        });
      }
    };
  }
]);'use strict';
// Lists controller
angular.module('admin').controller('AdminController', [
  '$scope',
  '$http',
  'Authentication',
  '$stateParams',
  '$location',
  '$modal',
  '$log',
  function ($scope, $http, Authentication, $stateParams, $location, $modal, $log) {
    $scope.user = Authentication.user;
    $scope.weeks = 0;
    $scope.camp_options = [];
    $scope.formData = {};
    $scope.data = {};
    // download CV
    $scope.download = function (path) {
      var fullPath = '/admin/download?file=' + path;
      window.open(fullPath, '_parent');
    };
    // Create new user
    $scope.create = function (role) {
      if (role === 'admin') {
        $scope.credentials.role = 'admin';
      }
      if (role === 'inst') {
        $scope.credentials.role = 'instructor';
      }
      $http.post('/admin/create', $scope.credentials).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
        if (response.role === 'instructor') {
          $location.path('/admin/instrs');
        } else {
          $location.path('/admins');
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.viewTrainees = function () {
      $http.get('/admin/trainees').success(function (response) {
        // If successful show success message and clear form
        $scope.role = [];
        $scope.success = true;
        $scope.trainees = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.listApplicants = function () {
      $http.get('/admin/applicants').success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.applicants = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.viewApplicant = function () {
      $http.get('/admin/applicant/' + $stateParams.apptId).success(function (response) {
        // If successful show success message and clear form
        $scope.data = {};
        $scope.success = true;
        $scope.appt = response;
        $scope.skillSet = response.skillSet;
        $scope.currPlacementEditorEnabled = false;
        $scope.editableCurrCompany = '';
        $scope.startDateEditorEnabled = false;
        $scope.endDateEditorEnabled = false;
        $scope.editableStartDate = '';
        $scope.editableEndDate = '';
        $scope.editableName = '';
        $scope.email = '';
        $scope.skillNameEditorEnabled = [];
        $scope.skillScoreEditorEnabled = [];
        $scope.editableSkillName = [];
        $scope.editableSkillScore = [];
        $scope.editableDetails = [];
        for (var i in $scope.appt.skillSet) {
          $scope.skillNameEditorEnabled[i] = false;
          $scope.skillScoreEditorEnabled[i] = false;
          $scope.editableSkillName[i] = '';
          $scope.editableSkillScore[i] = 1;
        }
        $scope.enableNameEditor = function (field) {
          if (field === 'name') {
          }
          ;
        };
        $scope.enableCurrPlacementEditor = function (field) {
          if (field === 'company') {
            $scope.currPlacementEditorEnabled = true;
            $scope.editableCurrCompany = $scope.appt.currPlacement.status;
          }
          if (field === 'startDate') {
            $scope.startDateEditorEnabled = true;
            $scope.editableStartDate = '';
          }
          if (field === 'endDate') {
            $scope.endDateEditorEnabled = true;
            $scope.editableEndDate = '';
          }
        };
        $scope.enableskillEditor = function (field, index) {
          if (field === 'skillName') {
            $scope.skillNameEditorEnabled[index] = true;
            $scope.editableSkillName[index] = $scope.appt.skillSets[index].skill;
          }
          if (field === 'skillScore') {
            $scope.skillScoreEditorEnabled[index] = true;
            $scope.editableSkillScore[index] = $scope.appt.skillSets[index].rating;
          }
        };
        $scope.disableskillEditor = function (field, index) {
          if (field === 'skillName') {
            $scope.skillNameEditorEnabled[index] = false;
          }
          if (field === 'skillScore') {
            $scope.skillScoreEditorEnabled[index] = false;
          }
        };
        $scope.disableCurrPlacementEditor = function (field, index) {
          if (field === 'company') {
            $scope.currPlacementEditorEnabled = false;
          }
          if (field === 'startDate') {
            $scope.startDateEditorEnabled = false;
          }
          if (field === 'endDate') {
            $scope.endDateEditorEnabled = false;
          }
        };
        $scope.saveskill = function (field, index) {
          if (field === 'skillName') {
            $scope.appt.skillSets[index].skill = $scope.editableSkillName[index];
            $scope.updateSkill($scope.appt, index);
          }
          if (field === 'skillScore') {
            $scope.appt.skillSets[index].rating = $scope.editableSkillScore[index];
            $scope.updateSkill($scope.appt, index);
          }
          $scope.disableskillEditor(field, index);
        };
        $scope.saveCurrPlacement = function (field, index) {
          if (field === 'company') {
            $scope.appt.currPlacement.status = $scope.editableCurrCompany;
            $scope.updatePlacement($scope.appt);
            $scope.disableCurrPlacementEditor('company');
          }
          if (field === 'startDate') {
            $scope.appt.currPlacement.startDate = $scope.editableStartDate;
            $scope.updatePlacement($scope.appt);
            $scope.disableCurrPlacementEditor('startDate');
          }
          if (field === 'endDate') {
            $scope.appt.currPlacement.endDate = $scope.editableEndDate;
            $scope.updatePlacement($scope.appt);
            $scope.disableCurrPlacementEditor('endDate');
          }
        };
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.updateSkill = function (appt, index) {
      $http.put('/admin/trainee/' + appt._id + '/rate/' + appt.skillSets[index]._id, appt.skillSets[index]).success(function (response) {
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.updatePlacement = function (appt) {
      $http.put('/admin/fellow/' + appt._id + '/placement', appt.currPlacement).success(function (response) {
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.deleteUser = function (userId, index) {
      $scope.camp.applicants.splice(index, 1);
      $http.put('/admin/camp/' + $scope.camp._id, $scope.camp).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
      $http.delete('/admin/user/' + userId).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.deleteAdmin = function (userId, index) {
      $scope.admins.splice(index, 1);
      $http.delete('/admin/user/' + userId).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.deleteInstr = function (userId, index) {
      $scope.instructors.splice(index, 1);
      $http.delete('/admin/user/' + userId).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.deleteFellow = function (userId, index) {
      $scope.fellows.splice(index, 1);
      $http.delete('/admin/user/' + userId).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.getSkillLevel = function (val) {
      val = parseInt(val);
      if (val <= 2) {
        return 'beginner';
      } else if (val <= 4) {
        return 'junior';
      } else if (val <= 6) {
        return 'intermediate';
      } else if (val <= 8) {
        return 'senior';
      } else {
        return 'expert';
      }
    };
    $scope.listFellows = function () {
      $http.get('/admin/fellows').success(function (response) {
        // If successful show success message and clear form
        $scope.fellows = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.IsFellowUnavailable = function (fellow) {
      var weeks = parseInt($scope.weeks);
      var date = moment().add(weeks, 'weeks');
      if (!fellow.placements) {
        return true;
      }
      if (fellow.placements && fellow.placements.length === 0 || weeks === 0) {
        return true;
      } else if (moment(fellow.placements[0].end_date) > date) {
        return false;
      } else {
        return true;
      }
    };
    $scope.get_availability_date = function (fellow) {
      if (fellow.placements && fellow.placements.length > 0) {
        if (moment(fellow.placements[0].end_date) > moment()) {
          return moment(fellow.placements[0].end_date).format('LL');
        } else {
          return 'Now';
        }
      } else {
        return 'Now';
      }
    };
    $scope.get_fellow_work_days = function (fellow) {
      var oneday = 24 * 3600 * 1000;
      if (fellow.placements && fellow.placements.length > 0) {
        var curr_date = new Date();
        var fellowavailabilityweeks = Math.ceil(new Date(fellow.placements[0].end_date).getTime() - curr_date.getTime()) / (oneday * 7);
        if (fellowavailabilityweeks <= 0) {
          return 0;
        } else {
          return Math.ceil(fellowavailabilityweeks);
        }
      } else {
        return 0;
      }
    };
    $scope.check_placement = function (placement, index) {
      if ($scope.get_fellow_work_days(placement) <= 0) {
        $scope.fellows[index].available = 'Needs Work';
        $scope.fellows[index].week = $scope.get_fellow_work_days(placement);
      } else {
        $scope.fellows[index].available = 'Currently Placed';
        $scope.fellows[index].week = $scope.get_fellow_work_days(placement);
      }
    };
    $scope.listInstructors = function () {
      $http.get('/admin/instructors').success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.listAdmins = function () {
      $http.get('/admin/admins').success(function (response) {
        // If successful show success message and clear form
        $scope.admins = response;
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.listInstructors = function () {
      $http.get('/admin/instructors').success(function (response) {
        // If successful show success message and clear form
        $scope.instructors = response;
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.changeRoleToFellow = function (trainee_id, index) {
      $scope.trainees.splice(index, 1);
      $http.put('/admin/applicant/' + trainee_id + '/role', { role: $scope.role[index] }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.viewInstructor = function (instrId) {
      $http.get('/admin/applicant/' + instrId).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.rateFellow = function (traineeId, skillId, newRating) {
      var url = '/admin/trainee/' + traineeId + '/skills/' + skillId;
      $http.put(url, { rating: newRating }).success(function (response) {
        $scope.success = true;
        $scope.appt = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.addPlacement = function () {
      $http.post('/admin/fellow/' + $stateParams.apptId + '/placements', $scope.data).success(function (response) {
        // If successful show success message and clear form
        $scope.data.company = '';
        $scope.data.jobDescription = '';
        $scope.data.start_date = '';
        $scope.data.end_date = '';
        $scope.appt = response;
      }).error(function (response) {
        $scope.error = response.message;
        if ($scope.error.type === 'date') {
          $scope.error = 'Please follow the date pattern specified M/D/YY e.g (use 2/5/2014 for 5th Feb 2014)';
        }
      });
    };
    /*SKILLS*/
    $scope.listSkills = function () {
      $http.get('/admin/skills').success(function (response) {
        $scope.skills = response;
      }).error(function (response) {
        $scope.error = response.message;
        $location.path('/admin/welcome');
      });
    };
    $scope.openSkillModal = function (size) {
      var modalInstance = $modal.open({
          templateUrl: '/modules/admin/views/admin.skills_modal.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            categories: function () {
              return $scope.skillCategories;
            }
          }
        });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    $scope.getSkillCategories = function () {
      $http.get('/admin/skillCategories').success(function (response) {
        $scope.skillCategories = response;
      }).error(function (response) {
        $scope.error = response.message;
        $location.path('/admin/welcome');
      });
    };
    /*DELETE CATEGORY*/
    $scope.deleteSkillCategory = function (catId, index) {
      $scope.skills.splice(index, 1);
      $http.delete('/admin/skillCategories/' + catId).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
var ModalInstanceCtrl = function ($http, $scope, $route, $modalInstance, categories) {
  $scope.categories = categories;
  $scope.data = {};
  $scope.data.category = categories[0];
  $scope.createCategory = false;
  $scope.ok = function () {
    $modalInstance.close('close');
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  $scope.createSkillCategory = function () {
    $http.post('/admin/skillCategories', $scope.data).success(function (response) {
      $scope.categories.push(response);
      $scope.createCategory = false;
      $scope.data.name = '';
    }).error(function (response) {
      $scope.error = response.message;
    });
  };
  $scope.createSkill = function () {
    var url = '/admin/skillCategories/' + $scope.data.category._id + '/skills';
    $http.post(url, $scope.data).success(function (response) {
      $route.reload();
    }).error(function (response) {
      $scope.error = response.message;
    });
  };
  $scope.showCreateCategory = function () {
    $scope.createCategory = true;
  };
};'use strict';
// Lists controller
angular.module('admin').controller('TestsController', [
  '$scope',
  '$http',
  'Authentication',
  '$stateParams',
  '$location',
  '$modal',
  '$log',
  'Tests',
  function ($scope, $http, Authentication, $stateParams, $location, $modal, $log, Tests) {
    $scope.choiceOne = [
      { id: 'choice1' },
      { id: 'choice2' }
    ];
    //answer to question one
    $scope.choiceTwo = [
      { id: 'choice1' },
      { id: 'choice2' }
    ];
    //answer to question two
    $scope.optionOne = [];
    //options for question one
    $scope.optionTwo = [];
    //options for question two
    $scope.questions = [];
    $scope.selected = '';
    $scope.testName = '';
    $scope.answered = false;
    $scope.answeredTwo = false;
    $scope.setShow = function (val) {
      $scope.selected = val;
    };
    $scope.isSelected = function (val) {
      return val === $scope.selected;
    };
    $scope.addNewChoice = function (num) {
      var newItemNo;
      if (num === 1) {
        newItemNo = $scope.choiceOne.length + 1;
        $scope.choiceOne.push({ id: 'choice' + newItemNo });
      } else {
        newItemNo = $scope.choiceTwo.length + 1;
        $scope.choiceTwo.push({ id: 'choice' + newItemNo });
      }
    };
    $scope.deleteChoice = function (index, num) {
      if (num === 1) {
        if (parseInt($scope.test.answerOne, 10) === $scope.choiceOne.length - 1) {
          $scope.test.answerOne = $scope.test.answerOne - 1;
        }
        doDelete($scope.choiceOne, $scope.optionOne, index);
      } else {
        if (parseInt($scope.test.answerTwo, 10) === $scope.choiceTwo.length - 1) {
          $scope.test.answerTwo = $scope.test.answerTwo - 1;
        }
        doDelete($scope.choiceTwo, $scope.optionTwo, index);
      }
    };
    var doDelete = function (choiceArr, optionArr, index) {
      choiceArr.splice(index, 1);
      optionArr.splice(index, 1);
      for (var i in choiceArr) {
        choiceArr[i].id = 'choice' + i;
      }
    };
    $scope.showAddChoice = function (choice, num) {
      if (num === 1)
        return choice.id === $scope.choiceOne[$scope.choiceOne.length - 1].id;
      else
        return choice.id === $scope.choiceTwo[$scope.choiceTwo.length - 1].id;
    };
    $scope.changeAnsVal = function (index, num) {
      if (num === 1) {
        $scope.answered = true;
      } else {
        $scope.answeredTwo = true;
      }
    };
    $scope.createTest = function () {
      var test = new Tests({
          questions: $scope.questions,
          optionOne: $scope.optionOne,
          optionTwo: $scope.optionTwo,
          testName: $scope.testName,
          answerOne: $scope.test.answerOne,
          answerTwo: $scope.test.answerTwo
        });
      test.$save(function (response) {
        $location.path('/admin/test');
      }, function (response) {
        $scope.error = response.message;
      });
    };
    $scope.createQuestion = function () {
      var test = new Tests({
          _id: $stateParams.testId,
          question: $scope.question,
          option: $scope.optionOne,
          answer: $scope.test.answerOne
        });
      test.$save(function (response) {
        $location.path('/admin/test');
      }, function (err) {
        $scope.error = err.message;
      });
    };
    $scope.viewTests = function () {
      var tests = Tests.query(function success(response) {
          $scope.tests = response;
        });
    };
    $scope.viewTest = function () {
      Tests.get({ testId: $stateParams.testId }, function success(response) {
        $scope.test = response;
        $scope.testNameEditorEnabled = false;
        $scope.questionEditorEnabled = [];
        $scope.editableQuestion = [];
        $scope.optionEditorEnabled = [];
        $scope.editableOption = [];
        $scope.displayerrmsg = [];
        for (var i in $scope.test.questions) {
          $scope.questionEditorEnabled[i] = false;
          $scope.optionEditorEnabled[i] = [];
          $scope.editableOption[i] = [];
          for (var j in $scope.test.questions[i].questOptions) {
            $scope.optionEditorEnabled[i][j] = false;
            $scope.editableOption[i][j] = {};
          }
        }
        $scope.enableEditor = function (field, index, optionIndex) {
          if (field === 'testName') {
            $scope.testNameEditorEnabled = true;
            $scope.editabletestName = $scope.test.testName;
          }
          if (field === 'question') {
            $scope.questionEditorEnabled[index] = true;
            $scope.editableQuestion[index] = $scope.test.questions[index].question;
          }
          if (field === 'option') {
            $scope.optionEditorEnabled[index][optionIndex] = true;
            $scope.editableOption[index][optionIndex].option = $scope.test.questions[index].questOptions[optionIndex].option;
          }
        };
        $scope.disableEditor = function (field, index, optionIndex) {
          if (field === 'testName') {
            $scope.testNameEditorEnabled = false;
          }
          if (field === 'question') {
            $scope.questionEditorEnabled[index] = false;
          }
          if (field === 'option') {
            $scope.optionEditorEnabled[index][optionIndex] = false;
          }
        };
        // Checks to see if all answers are set to same (false/true).
        // Returns true if all are the same
        var checkAllanswers = function (questOptions) {
          var firstOption = questOptions[0].answer;
          for (var i in questOptions) {
            if (firstOption !== questOptions[i].answer) {
              return false;
            }
          }
          return true;
        };
        $scope.save = function (field, index, optionIndex) {
          if (field === 'testName') {
            $scope.test.testName = $scope.editabletestName;
            $scope.changeTestName($scope.test);
          }
          if (field === 'question') {
            $scope.test.questions[index].question = $scope.editableQuestion[index];
            $scope.updateQuestion($scope.test, index);
          }
          if (field === 'option') {
            $scope.test.questions[index].questOptions[optionIndex].option = $scope.editableOption[index][optionIndex].option;
            if ($scope.editableOption[index][optionIndex].answer === undefined || $scope.editableOption[index][optionIndex].answer === 'undefined') {
              $scope.editableOption[index][optionIndex].answer = false;
            }
            // if the option's answer field changes, then change others to it's oppossite
            if ($scope.editableOption[index][optionIndex].answer === true) {
              for (var i in $scope.test.questions[index].questOptions) {
                if (i === optionIndex) {
                  continue;
                }
                $scope.test.questions[index].questOptions[i].answer = false;
              }
            }
            $scope.test.questions[index].questOptions[optionIndex].answer = $scope.editableOption[index][optionIndex].answer;
            // Set error message if no answer is selected
            if (checkAllanswers($scope.test.questions[index].questOptions)) {
              $scope.displayerrmsg[index] = true;
            } else {
              $scope.displayerrmsg[index] = false;
            }
            $scope.updateQuestion($scope.test, index);
          }
          $scope.disableEditor(field, index, optionIndex);
        };
      }  //ends test.get() success callbk
);
    };
    $scope.changeTestName = function (test) {
      test.$update({ _id: test._id }, function success() {
      }, function (errorResponse) {
        $scope.error = errorResponse;
      });
    };
    $scope.updateQuestion = function (test, quesIndex) {
      var question = test.questions[quesIndex];
      $http.put('/admin/test/' + test._id + '/' + test.questions[quesIndex]._id, question).success(function (response) {
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.deleteTest = function (test, index) {
      $scope.tests.splice(index, 1);
      test.$remove({ _id: test._id }, function success() {
      }, function (response) {
        $scope.error = response.message;
      });
    };
    $scope.deleteQuestion = function (testId, questionId, index) {
      $scope.test.questions.splice(index, 1);
      $http.delete('/admin/test/' + testId + '/' + questionId).success(function (response) {
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.deleteOption = function (testId, questionId, optionId, queIndex, index) {
      $scope.test.questions[queIndex].questOptions.splice(index, 1);
      $http.delete('/admin/test/' + testId + '/' + questionId + '/' + optionId).success(function (response) {
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Admin service for admin variables
angular.module('admin').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('admin', {}, { update: { method: 'PUT' } });
  }
]).filter('range', function () {
  return function (input, total, start) {
    total = parseInt(total);
    for (var i = start; i < total; i++)
      input.push(i);
    return input;
  };
}).factory('Tests', [
  '$resource',
  function ($resource) {
    return $resource('admin/test/:testId', { testId: '@_id' }, { update: { method: 'PUT' } });
  }
]).factory('Bootcamp', [
  '$resource',
  function ($resource) {
    return $resource('admin/camp/:campId', { campId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
angular.module('applicant-test').config([
  '$stateProvider',
  function ($stateProvider) {
    // Test state routing
    $stateProvider.state('listTest', {
      url: '/test/:testId',
      templateUrl: 'modules/applicant-test/views/test.client.view.html'
    });
  }
]);'use strict';
angular.module('applicant-test').controller('ApplicantTestController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Questions',
  '$http',
  function ($scope, $stateParams, $location, Authentication, Questions, $http) {
    $scope.authentication = Authentication;
    $scope.find = function () {
      $http.get('/test/').success(function (response) {
        $scope.questions = response;
      });
    };
  }
]);'use strict';
// Test service used for communicating with the tests REST endpoints
angular.module('applicant-test').factory('Questions', [
  '$resource',
  function ($resource) {
    return $resource('/test/:testId', { testId: '@_id' }, { updates: { method: 'PUT' } });
  }
]);'use strict';
//Setting up route
angular.module('applicant').config([
  '$stateProvider',
  function ($stateProvider) {
    // Applicant state routing
    $stateProvider.state('applicantsprofile', {
      url: '/profile/applicant',
      templateUrl: 'modules/applicant/views/applicantion.client.view.html'
    }).state('fellowsprofile', {
      url: '/profile/fellows',
      templateUrl: 'modules/applicant/views/list.fellow.client.view.html'
    }).state('traineesprofile', {
      url: '/profile/trainee',
      templateUrl: 'modules/applicant/views/trainee.client.view.html'
    }).state('fellow-profile', {
      url: '/profile/:applicantId',
      templateUrl: 'modules/applicant/views/fellow.client.view.html'
    }).state('logged_in-profile', {
      url: '/logged_in_user/:logged_inId',
      templateUrl: 'modules/applicant/views/logged_in.user.client.view.html'
    }).state('application', {
      url: '/signup',
      templateUrl: 'modules/applicant/views/applicant.client.view.html'
    }).state('success', {
      url: '/successpage',
      templateUrl: 'modules/applicant/views/success.client.view.html'
    }).state('error_page', {
      url: '/errorpage',
      templateUrl: 'modules/applicant/views/error.client.view.html'
    });
  }
]);'use strict';
angular.module('applicant').controller('ApplicantController', [
  '$scope',
  '$upload',
  '$http',
  'Authentication',
  '$stateParams',
  '$location',
  'Applicants',
  'Users',
  'Bootcamps',
  'Questions',
  function ($scope, $upload, $http, Authentication, $stateParams, $location, Applicants, Users, Bootcamps, Questions) {
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    $scope.isClicked = false;
    $scope.clicked = function () {
      $scope.isClicked = true;
      $scope.showLoader = true;
      $scope.signup();
    };
    $scope.findCamp = function () {
      $scope.result;
      Bootcamps.query().$promise.then(function (value) {
        $scope.camp = value[0]._id;
      }, function (err) {
        return err;
      });
    };
    $scope.field = 1;
    $scope.username = '';
    $scope.password1 = '';
    $scope.cpassword1 = '';
    $scope.state = false;
    $scope.show_next = function (value) {
      if (value < 4) {
        $scope.field++;
        $scope.result = [
          $scope.username,
          $scope.password1,
          $scope.cpassword1,
          $scope.gender
        ];
        if (value === 4) {
          math.ceil;
        }
      }
    };
    $scope.show_prev = function (value) {
      if (value > 1) {
        $scope.field--;
      }
    };
    $scope.findOneQuestion = function () {
      Questions.query().$promise.then(function (response) {
        $scope.questions = response[0];
      }, function (err) {
        return err;
      });
    };
    $scope.options = [];
    $scope.assess = function (test, option) {
      if ($scope.options.length === 0) {
        $scope.options.push({
          question: test,
          answer: option
        });
      } else {
        for (var i = 0; i < $scope.options.length; i++) {
          if (test === $scope.options[i].question) {
            $scope.options[i].answer = option;
          } else {
            $scope.options.push({
              question: test,
              answer: option
            });
          }
        }
        ;
      }
      ;
    };
    // cv upload
    $scope.onFileSelect = function ($files) {
      $scope.files = $files;
      if ($scope.files) {
        if ($scope.files[0].type === 'application/pdf' || $scope.files[0].type === 'application/msword' || $scope.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          $scope.correctFormat = true;
        } else {
          $scope.correctFormat = false;
        }
      }
    };
    $scope.correctAnswers = 0;
    $scope.signup = function () {
      var user = new Users($scope.user);
      for (var i in $scope.questions.questions) {
        var choices = $scope.questions.questions[i].questOptions;
        for (var j in choices) {
          if (choices[j]._id === $scope.options[i].answer && choices[j].answer === true) {
            $scope.correctAnswers += 1;
            break;
          }
          ;
        }
        ;
      }
      ;
      $scope.testScore = Math.round($scope.correctAnswers / $scope.questions.questions.length * 100);
      $scope.user.type = 'applicant';
      $scope.user.testScore = $scope.testScore;
      $scope.upload = $upload.upload({
        url: '/auth/' + $scope.camp + '/signup',
        method: 'Post',
        data: $scope.user,
        file: $scope.files[0]
      }).success(function (response) {
        $scope.logId = response;
        $scope.authentication.user = response;
        $location.path('/successpage');
      }).error(function (err) {
      });
    };
    $scope.findOne = function () {
      Applicants.get({ applicantId: $stateParams.applicantId }).$promise.then(function (response) {
        $scope.applicant = response;
      }, function (err) {
        $scope.error = err.message;
        $location.path('/');
      });
    };
    $scope.show_profile = function () {
      var url = '/users/' + $stateParams.logged_inId;
      $http.get(url).success(function (response) {
        $scope.user_profile = response;
      }).error(function (response) {
        $scope.error = response.message;
        $http.get('/auth/signout');
        $location.path('/errorpage');
      });
    };
  }
]);
angular.module('applicant').directive('ngConfirmField', function () {
  return {
    require: 'ngModel',
    scope: { confirmAgainst: '=' },
    link: function (scope, iElement, iAttrs, ngModelCtrl) {
      var updateValidity = function () {
        var viewValue = ngModelCtrl.$viewValue;
        var isValid = isFieldValid();
        if (ngModelCtrl.$viewValue)
          ngModelCtrl.$setValidity('noMatch', isValid);
        // If the field is not valid, return undefined.
        return isValid ? viewValue : undefined;
      };
      // Test the confirm field view value matches the confirm against value.
      var isFieldValid = function () {
        return ngModelCtrl.$viewValue === scope.confirmAgainst;
      };
      // Convert data from view format to model format
      ngModelCtrl.$parsers.push(updateValidity);
      // Watch for changes in the confirmAgainst model.
      scope.$watch('confirmAgainst', updateValidity);
    }
  };
});
angular.module('applicant').directive('ensureUnique', [
  '$http',
  function ($http) {
    return {
      require: 'ngModel',
      link: function (scope, ele, attrs, c, ngModel) {
        attrs.$observe('ngModel', function (value) {
          scope.$watch(value, function (newValue) {
            $http({
              method: 'POST',
              url: '/users/check/uniqueUsername',
              data: { 'username': newValue }
            }).success(function (data, status, headers, cfg) {
              if (data.length > 0) {
                c.$setValidity('unique', false);
              } else {
                c.$setValidity('unique', true);
              }
            }).error(function (data, status, headers, cfg) {
              c.$setValidity('unique', true);
            });
          });
        });
      }
    };
  }
]);'use strict';
//Applicants service used for communicating with the camp REST endpoints
angular.module('applicant').factory('Applicants', [
  '$resource',
  function ($resource) {
    return $resource('applicants/:applicantId', { applicantId: '@_id' }, { update: { method: 'PUT' } });
  }
]);
angular.module('applicant').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users/:userId', { userId: '@_id' }, { update: { method: 'PUT' } });
  }
]);
angular.module('applicant').factory('Bootcamps', [
  '$resource',
  function ($resource) {
    return $resource('/camps', {}, { update: { method: 'PUT' } });
  }
]);
//Test service used for communicating with the tests REST endpoints
angular.module('applicant-test').factory('Questions', [
  '$resource',
  function ($resource) {
    return $resource('/test/:testId', { testId: '@_id' }, { updates: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    }).state('mission', {
      url: '/mission',
      templateUrl: 'modules/core/views/mission.client.view.html'
    }).state('about', {
      url: '/meet_team',
      templateUrl: 'modules/core/views/about.client.view.html'
    }).state('andela_network', {
      url: '/andela_network',
      templateUrl: 'modules/core/views/andela.network.client.view.html'
    }).state('skill_focus', {
      url: '/skill_focus',
      templateUrl: 'modules/core/views/skill_focus.client.view.html'
    }).state('timeline', {
      url: '/timeline',
      templateUrl: 'modules/core/views/timeline.client.view.html'
    }).state('selection', {
      url: '/selection',
      templateUrl: 'modules/core/views/selection.client.view.html'
    }).state('assessment', {
      url: '/assessment',
      templateUrl: 'modules/core/views/take_assessment.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  '$location',
  'Authentication',
  'Menus',
  'anchorSmoothScroll',
  function ($scope, $location, Authentication, Menus, anchorSmoothScroll) {
    $scope.authentication = Authentication;
    $scope.user = $scope.authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
    $('#nav li a').click(function (e) {
      e.preventDefault();
      var $this = $(this);
      var $nav = $(this).parent();
      $nav.siblings('li').removeClass('active');
      $nav.removeClass().addClass('active');
    });
    var scrollTimeout;
    $('a.scroll-top').click(function () {
      $('html,body').animate({ scrollTop: 0 }, 500);
      return false;
    });
    $(window).scroll(function () {
      clearTimeout(scrollTimeout);
      if ($(window).scrollTop() > 400) {
        scrollTimeout = setTimeout(function () {
          $('a.scroll-top:hidden').fadeIn();
        }, 100);
      } else {
        scrollTimeout = setTimeout(function () {
          $('a.scroll-top:visible').fadeOut();
        }, 100);
      }
    });
    $scope.gotoElement = function (eID) {
      // call $anchorScroll()
      anchorSmoothScroll.scrollTo(eID);
    };
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['user'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic || this.menus[menuId].isPublic,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic || this.menus[menuId].isPublic,
            roles: roles || this.defaultRoles,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);
// angular.module('core').factory('anchorSmoothScroll', function function_name (argument) {
// 	// body...
// })
angular.module('core').service('anchorSmoothScroll', function () {
  this.scrollTo = function (eID) {
    // This scrolling function 
    // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
      scrollTo(0, stopY);
      return;
    }
    var speed = Math.round(distance / 100);
    if (speed >= 20)
      speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
      for (var i = startY; i < stopY; i += step) {
        setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
        leapY += step;
        if (leapY > stopY)
          leapY = stopY;
        timer++;
      }
      return;
    }
    for (var i = startY; i > stopY; i -= step) {
      setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
      leapY -= step;
      if (leapY < stopY)
        leapY = stopY;
      timer++;
    }
    function currentYPosition() {
      // Firefox, Chrome, Opera, Safari
      if (self.pageYOffset)
        return self.pageYOffset;
      // Internet Explorer 6 - standards mode
      if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
      // Internet Explorer 6, 7 and 8
      if (document.body.scrollTop)
        return document.body.scrollTop;
      return 0;
    }
    function elmYPosition(eID) {
      var elm = document.getElementById(eID);
      var y = elm.offsetTop;
      var node = elm;
      while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
      }
      return y;
    }
  };
});'use strict';
// Setting up route
angular.module('instructors').config([
  '$stateProvider',
  function ($stateProvider) {
    // Instructors state routing
    $stateProvider.state('instructor_signin', {
      url: '/instructors',
      templateUrl: 'modules/instructors/views/instructor_signin.client.view.html'
    }).state('instructorshome', {
      url: '/instructors/home',
      templateUrl: 'modules/instructors/views/instructors_home.client.view.html'
    }).state('list_Trainees', {
      url: '/instructors/trainees',
      templateUrl: 'modules/instructors/views/list-trainees.client.view.html'
    }).state('view_Trainee', {
      url: '/instructors/trainees/:applicantId',
      templateUrl: 'modules/instructors/views/view-trainee.client.view.html'
    }).state('create_Assessment', {
      url: '/instructors/trainees/:applicantId/create_assessment',
      templateUrl: 'modules/instructors/views/create-assessment.client.view.html'
    }).state('editAssessment', {
      url: '/instructors/trainees/:applicantId/:assessmentId/edit',
      templateUrl: 'modules/instructors/views/edit-assessment.client.view.html'
    }).state('selected_fellow', {
      url: '/instructors/fellow_selected/:applicantId',
      templateUrl: 'modules/instructors/views/selected-fellow.client.view.html'
    }).state('list_Fellows', {
      url: '/instructors/fellows',
      templateUrl: 'modules/instructors/views/list-fellows.client.view.html'
    }).state('viewFellow', {
      url: '/instructors/fellows/:fellowId',
      templateUrl: 'modules/instructors/views/view-fellow.client.view.html'
    }).state('ratefellow', {
      url: '/instructors/fellow/:fellowId/rate',
      templateUrl: 'modules/instructors/views/rate.fellow.client.view.html'
    }).state('editRate', {
      url: '/instructors/fellow/:fellowId/:skillSetId/editRate',
      templateUrl: 'modules/instructors/views/edit-rate.client.view.html'
    }).state('listBootcamps', {
      url: '/instructors/bootcamps',
      templateUrl: 'modules/instructors/views/list-bootcamps.client.view.html'
    }).state('viewBootcamp', {
      url: '/instructors/bootcamps/:bootcampId',
      templateUrl: 'modules/instructors/views/view-bootcamp.client.view.html'
    }).state('editProfile', {
      url: '/instructors/editProfile',
      templateUrl: 'modules/instructors/views/edit-profile.client.view.html'
    }).state('change_Password', {
      url: '/change-password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('addSkills', {
      url: '/instructors/addSkill',
      templateUrl: 'modules/instructors/views/skills.client.view.html'
    }).state('editSkills', {
      url: '/instructors/editSkills',
      templateUrl: 'modules/instructors/views/edit-skill.client.view.html'
    });
  }
]);'use strict';
angular.module('instructors').controller('AssessmentController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Assessment',
  '$http',
  function ($scope, $stateParams, $location, Authentication, Assessment, $http) {
    $scope.editStates = [];
    var date = new Date(), year = date.getFullYear(), month = date.getMonth(), day = date.getDate();
    // month 2 digits
    month = ('0' + (month + 1)).slice(-2);
    // year 2 digits
    year = year.toString().substr(2, 2);
    var formattedDate = month + '/' + day + '/' + year;
    $scope.date = formattedDate;
    $scope.initEditStates = function () {
      for (var i in $scope.assessments) {
        $scope.editStates[i] = false;
      }
    };
    $scope.initEditStates();
    $scope.models = [];
    // create assessment record
    $scope.createAssessment = function () {
      // create new assessment for trainee 
      var assmntObject = {
          traineeId: $stateParams.applicantId,
          assessment_name: $scope.assessment_name,
          assessment_date: $scope.date,
          score: $scope.score
        };
      var assessment = new Assessment(assmntObject);
      assessment.$save(function success(response) {
        $location.path('/instructors/trainees/' + $stateParams.applicantId);
      }, function (error) {
        $scope.error = error.data.message;
      });
    };
    // edit trainee assessment record
    $scope.updateAssessment = function (index, assessment, model) {
      var assessment = new Assessment(assessment);
      assessment.traineeId = assessment.applicantId;
      if (typeof model.newScore !== 'undefined') {
        if (model.newScore.length !== 0) {
          assessment.score = model.newScore;
        }
      }
      if (typeof model.newName !== 'undefined') {
        if (model.newName.length !== 0) {
          assessment.assessment_name = model.newName;
        }
      }
      if (typeof model.newDate !== 'undefined') {
        if (model.newDate.length !== 0) {
          var pattern = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(199\d|[2-9]\d{3})$/;
          if (pattern.test(model.newDate) === true) {
            assessment.assessment_date = model.newDate;
          } else {
            alert('Date format should be MM/dd/yyyy');
            return;
          }
        }
      }
      assessment.$update(function success(response) {
        $scope.editStates[index] = false;
        $scope.assessments = response.assessments;
      }, function (error) {
        $scope.error = error.message;
      });
    };
    // delete trainee assessment record
    $scope.deleteAssessment = function (index, assessment) {
      $scope.assessments.splice(index, 1);
      var assessment = new Assessment(assessment);
      assessment.traineeId = assessment.applicantId;
      assessment.$remove(function success(response) {
        $scope.success = true;
      }, function (error) {
        $scope.error = error.message;
      });
    };
  }
]);'use strict';
// Instructors controller
angular.module('instructors').controller('InstructorsController', [
  '$scope',
  'Assessment',
  'Camp',
  '$upload',
  '$stateParams',
  '$location',
  'Authentication',
  '$http',
  function ($scope, Assessment, Camp, $upload, $stateParams, $location, Authentication, $http) {
    $scope.user = Authentication.user;
    // instructor signin 
    $scope.instructor_signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.user = response;
        // And redirect to the right page
        if ($scope.user.role === 'instructor') {
          $location.path('/instructors/home');
        } else {
          $location.path('/');
        }
      }).error(function (response) {
        $scope.error = response.message;
        $location.path('/');
      });
    };
    // instructor's home page
    $scope.instructorHome = function () {
      if (!$scope.user) {
        $location.path('/');
      }
    };
    // list all bootcamps
    $scope.listBootcamps = function () {
      Camp.query(function success(response) {
        $scope.success = true;
        $scope.bootcamps = response;
        $scope.traineeCountArr = [];
        for (var i in $scope.bootcamps) {
          var traineeCount = 0;
          for (var j in $scope.bootcamps[i].applicants) {
            if ($scope.bootcamps[i].applicants[j].role === 'trainee') {
              traineeCount += 1;
            }
          }
          $scope.traineeCountArr.push(traineeCount);
        }
      }, function (error) {
        $scope.error = error.message;
      });
    };
    // viewing only a particular bootcamp
    $scope.viewBootcamp = function () {
      $scope.error = false;
      if ($stateParams.bootcampId.length === 0) {
        $scope.error = true;
      } else {
        Camp.get({ campId: $stateParams.bootcampId }, function success(response) {
          $scope.bootcamp = response;
          $scope.applicants = $scope.bootcamp.applicants;
        }, function (error) {
          $scope.error = true;
        });
      }
    };
    // filter to get only trainees
    $scope.onlyTrainees = function (applicant) {
      return applicant.role === 'trainee';
    };
    // list all trainees 
    $scope.listTrainees = function () {
      $http.get('/instructor/trainees').success(function (response) {
        $scope.success = true;
        $scope.trainees = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // view a particular trainee        
    $scope.viewTrainee = function () {
      if ($stateParams.applicantId === '') {
        $scope.error = true;
      } else {
        Assessment.get({ traineeId: $stateParams.applicantId }, function success(response) {
          $scope.success = true;
          $scope.error = false;
          $scope.trainee = response;
          $scope.assessments = $scope.trainee.assessments;
        }, function (error) {
          $scope.error = true;
        });
      }
    };
    // list all fellows
    $scope.listFellows = function () {
      $http.get('/instructor/fellows').success(function (response) {
        $scope.success = true;
        $scope.fellows = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // view a particular fellow
    $scope.viewFellow = function () {
      if ($stateParams.fellowId.length < 20) {
        $location.path('/');
      } else {
        $http.get('/instructor/trainee/' + $stateParams.fellowId).success(function (response) {
          $scope.success = true;
          $scope.fellow = response;
        }).error(function (response) {
          $scope.error = response.message;
        });
      }
    };
    // show instructor profile picture
    $scope.showImage = function (img) {
      if (img) {
        img = img.substring(6);
        return img;
      } else {
        return 'http://www.localcrimenews.com/wp-content/uploads/2013/07/default-user-icon-profile.png';
      }
    };
    // get assessment
    $scope.getAssessment = function () {
      $scope.error = false;
      Assessment.get({
        traineeId: $stateParams.applicantId,
        assmtId: $stateParams.assessmentId
      }, function success(response) {
        if (response._id) {
          $scope.assessment = response;
          var date = new Date($scope.assessment.assessment_date), year = date.getFullYear(), month = date.getMonth(), day = date.getDate();
          //month 2 digits
          month = ('0' + (month + 1)).slice(-2);
          //year 2 digits
          year = year.toString().substr(2, 2);
          $scope.assessment.assessment_date = month + '/' + day + '/' + year;
        } else {
          $scope.error = true;
        }
      }, function (error) {
        $scope.error = true;
      });
    };
  }
]);angular.module('instructors').controller('RateController', [
  '$scope',
  '$stateParams',
  '$location',
  '$http',
  function ($scope, $stateParams, $location, $http) {
    $scope.ratefellow = function () {
      // Permissions check
      $http.post('/instructor/trainee/' + $stateParams.fellowId + '/rate', $scope.data).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $location.path('/instructors/fellows/' + $stateParams.fellowId);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.deleteRate = function (index, skillSet) {
      $scope.skillSets = $scope.fellow.skillSets;
      $scope.skillSets.splice(index, 1);
      $http.delete('/instructor/trainee/' + $scope.fellow._id + '/rate/' + skillSet._id).success(function (response) {
        $scope.success = true;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.editFellowRate = function () {
      $http.put('/instructor/trainee/' + $stateParams.fellowId + '/rate/' + $stateParams.skillSetId, $scope.skillSetsNow).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $location.path('/instructors/fellows/' + $stateParams.fellowId);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
var ProfileController = function ($scope, $http, $upload, $stateParams, $location, Authentication) {
  $scope.user = Authentication.user;
  // Upload Image
  $scope.onFileSelect = function ($file) {
    $scope.file = $file;
    if ($scope.file) {
      if ($scope.file[0].type === 'image/jpeg' || $scope.file[0].type === 'image/png') {
        $scope.correctFormat = true;
      } else {
        $scope.correctFormat = false;
      }
    }
  };
  $scope.removeAlert = function (message) {
    if (message === 'error') {
      $scope.error = null;
    } else {
      $scope.success = null;
    }
  };
  // upload file
  $scope.create = function () {
    $scope.success = null;
    $scope.error = null;
    $scope.upload = $upload.upload({
      url: '/instructor/updateInfo',
      method: 'POST',
      data: $scope.user,
      file: $scope.file
    }).success(function (response) {
      $scope.user = Authentication.user = response;
      $scope.success = 'Your details have been updated successfully';
    }).error(function (err) {
      $scope.error = err.message;
    });
  };
  // delete profile picture
  $scope.deletePhoto = function ($index, photo) {
    $http.delete('/instructor/' + $scope.user._id + '/deletePhoto').success(function (response) {
      $scope.user.photo = response.photo;
    }).error(function (response) {
      $scope.error = response.message;
    });
  };
  // show instructor's profile photo
  $scope.showImage = function (img) {
    if (img) {
      img = img.substring(6);
      return img;
    } else {
      return 'http://www.localcrimenews.com/wp-content/uploads/2013/07/default-user-icon-profile.png';
    }
  };
};'use strict';
// Assessment service
angular.module('instructors').factory('Assessment', [
  '$resource',
  function ($resource) {
    return $resource('instructor/trainee/:traineeId/:assmtId', {
      traineeId: '@traineeId',
      assmtId: '@_id'
    }, { update: { method: 'PUT' } });
  }
]).factory('Camp', [
  '$resource',
  function ($resource) {
    return $resource('instructor/camp/:campId', { campId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/signin.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the right page
        if ($scope.authentication.user.role === 'admin') {
          $location.path('/admin/welcome');
        } else if ($scope.authentication.user.role === 'instructor') {
          $location.path('/instructors/home');
        } else if ($scope.authentication.user.role === 'fellow' || 'trainee' || 'applicant') {
          $location.path('/logged_in_user/' + $scope.authentication.user._id);
        } else {
          $location.path('/');
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$timeout',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $timeout, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function () {
      var user = new Users($scope.user);
      user.$update(function (response) {
        $scope.successOne = true;
        $scope.user = Authentication.user = response;
        $timeout(function () {
          $scope.successOne = null;
        }, 5000);
      }, function (response) {
        $scope.errorOne = response.data.message;
        $timeout(function () {
          $scope.errorOne = null;
        }, 5000);
      });
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/' + $scope.user._id + '/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);