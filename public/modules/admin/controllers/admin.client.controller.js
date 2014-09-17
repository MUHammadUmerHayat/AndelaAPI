
'use strict';

// Lists controller
angular.module('admin').controller('AdminController', ['$scope', '$http', 'Authentication', '$stateParams', '$location', '$modal', '$log',
  function($scope, $http, Authentication, $stateParams, $location, $modal, $log) {

    $scope.user = Authentication.user;

    $scope.weeks = 0;



    // Create new user
    $scope.create = function(role) {
        if (role === 'admin'){
            $scope.credentials.role = 'admin';
        }
        if (role === 'inst'){
            $scope.credentials.role = 'instructor';
        }
        // console.log('createInstructor called', $scope.credentials);
        $http.post('/admin/create', $scope.credentials).success(function(response) {
            // If successful show success message and clear form
            $scope.success = true;
            $scope.passwordDetails = null;
            if (response.role === 'instructor') {
                $location.path('/admin/instrs');
            }
            else{
                $location.path('/admins');
            }
        }).error(function(response) {
            $scope.error = response.message;
        });
    };

    /**
    * Create camp
    */
    $scope.createCamp = function() {
        $http.post('/admin/camp', $scope.credentials).success(function(response){
            $location.path('/admin/camps');
        }).error(function(response) {
            $scope.error = response.message;
            if ($scope.error.type === 'date'){
                $scope.error = 'Please follow the date pattern specified M/D/YY e.g (use 2/5/2014 for 5th Feb 2014)';
            }
        });
    };

    $scope.viewcamp = function() {
        $http.get('/admin/camp/' + $stateParams.campId).success(function(response) {
          $scope.camp = response;

          $scope.editorEnabled = false;

        // If successful show success message and clear form
        }).error(function(response) {
            $scope.error = response.message;

        });

    };

    $scope.enableApplicantEditor = function(index) {
        $scope.editorEnabled = true;
        $scope.formData.editableFirstName = $scope.camp.applicants[index].firstName;
        $scope.formData.editableLastName = $scope.camp.applicants[index].lastName;
        $scope.formData.editableEmail = $scope.camp.applicants[index].email;
    };
    $scope.disableApplicantEditor = function() {
        $scope.editorEnabled = false;
    };

    $scope.saveApplicant = function(index) {
        $scope.camp.applicants[index].firstName = $scope.formData.editableFirstName;
        $scope.camp.applicants[index].lastName = $scope.formData.editableLastName;
        $scope.camp.applicants[index].email = $scope.formData.editableEmail;

        var url = 'users/' + $scope.camp.applicants[index]._id;
        var data = {
            firstName: $scope.formData.editableFirstName,
            lastName: $scope.formData.editableLastName,
            email: $scope.formData.editableEmail
        };
        $http.put(url, data).success(function(response){
            console.log('success');
        }).error(function(response) {
            $scope.error = response.message;
        });
        $scope.disableApplicantEditor();
    };


    $scope.listcamps = function() {
        $http.get('/admin/camp').success(function(response) {

          // If successful show success message and clear form
            $scope.camps = response;
            console.log('success: ' + $scope.camps);
            for(var i = 0; i < response.length; i++){
                $scope.camp_options.push(response[i].camp_name);
            }

        }).error(function(response) {
            $scope.error = response.message;
            $location.path('/admin/welcome');

        });
    };


    $scope.viewTrainees = function() {
        $http.get('/admin/trainees').success(function(response) {
          // If successful show success message and clear form
            $scope.role = [];
            $scope.success = true;
            $scope.trainees = response;

        }).error(function(response) {
            $scope.error = response.message;
        });
    };

    $scope.listApplicants = function() {
        // $scope.statusInit = 'pending';
        $http.get('/admin/applicants').success(function(response) {
          // If successful show success message and clear form
            $scope.success = true;
            $scope.applicants = response;
            console.log('Applicant Init');
            console.log('appt: ' + $scope.applicants);

        }).error(function(response) {
            $scope.error = response.message;
        });
    };

    $scope.viewApplicant = function() {
      $http.get('/admin/appt/' + $stateParams.apptId).success(function(response) {
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
        $score.editableDetails = [];

        for (var i in $scope.appt.skillSet){
          $scope.skillNameEditorEnabled[i] = false;
          $scope.skillScoreEditorEnabled[i] = false;
          $scope.editableSkillName[i] = '';
          $scope.editableSkillScore[i] = 1;
        }

        $scope.enableNameEditor = function(field) {
          if (field === 'name') {};
        };

        $scope.enableCurrPlacementEditor = function(field) {
          if (field === 'company'){
            $scope.currPlacementEditorEnabled = true; 
            $scope.editableCurrCompany = $scope.appt.currPlacement.status; 
          }
          if (field === 'startDate'){
            $scope.startDateEditorEnabled = true; 
            $scope.editableStartDate = ''; 
          }
          if (field === 'endDate'){
            $scope.endDateEditorEnabled = true; 
            $scope.editableEndDate = ''; 
          }
        };

        $scope.enableskillEditor = function(field, index) {
          if (field === 'skillName'){
            $scope.skillNameEditorEnabled[index] = true; 
            $scope.editableSkillName[index] = $scope.appt.skillSets[index].skill; 
          }
          if (field === 'skillScore'){
            $scope.skillScoreEditorEnabled[index] = true; 
            $scope.editableSkillScore[index] = $scope.appt.skillSets[index].rating; 
          }
        };

        $scope.disableskillEditor = function(field, index) {
          if (field === 'skillName'){
            $scope.skillNameEditorEnabled[index] = false;
          }
          if (field === 'skillScore'){
            $scope.skillScoreEditorEnabled[index] = false;
          }
        };

        $scope.disableCurrPlacementEditor = function(field, index) {
          if (field === 'company'){
            $scope.currPlacementEditorEnabled = false;
          }
          if (field === 'startDate'){
            $scope.startDateEditorEnabled = false;
          }
          if (field === 'endDate'){
            $scope.endDateEditorEnabled = false;
          }
        };


        $scope.saveskill = function(field, index) {
          if (field === 'skillName'){
            $scope.appt.skillSets[index].skill = $scope.editableSkillName[index];
            $scope.updateSkill($scope.appt, index);
          }
          if (field === 'skillScore'){
            $scope.appt.skillSets[index].rating = $scope.editableSkillScore[index];
            $scope.updateSkill($scope.appt, index);
          }
          $scope.disableskillEditor(field, index);
        };

        $scope.saveCurrPlacement = function(field, index) {
          if (field === 'company'){
            $scope.appt.currPlacement.status = $scope.editableCurrCompany;
            $scope.updatePlacement($scope.appt);
            $scope.disableCurrPlacementEditor('company');
          }
          if (field === 'startDate'){
            $scope.appt.currPlacement.startDate = $scope.editableStartDate;
            $scope.updatePlacement($scope.appt);
            $scope.disableCurrPlacementEditor('startDate');
          }
          if (field === 'endDate'){
            $scope.appt.currPlacement.endDate = $scope.editableEndDate;
            $scope.updatePlacement($scope.appt);
            $scope.disableCurrPlacementEditor('endDate');
          }
        };
      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    $scope.updateSkill = function(appt, index) {
      $http.put('/admin/trainee/' + appt._id + '/rate/' + appt.skillSets[index]._id, appt.skillSets[index]).success(function(response) {
        console.log('Success - Done', response);
      }).error(function(response) {
        $scope.error = response.message;
        console.log($scope.error);
      });
    };

    $scope.updatePlacement = function(appt) {
      $http.put('/admin/fellow/' + appt._id + '/placement', appt.currPlacement).success(function(response) {
        console.log('Success - Done', response);
      }).error(function(response) {
        $scope.error = response.message;
        console.log($scope.error);
      });
    };


    $scope.deleteUser = function(userId, index) {
      $scope.camp.applicants.splice(index, 1);

      $http.put('/admin/camp/' + $scope.camp._id, $scope.camp).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;

        // $scope.appt = response;
        console.log('Edit bootcamp done', response);
        
      }).error(function(response) {
        $scope.error = response.message;
        console.log($scope.error);
        // console.log('Error - can not');
      });
    
      $http.delete('/admin/user/' + userId).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;

        // $scope.appt = response;
        console.log('Success - Done', response);
        
      }).error(function(response) {
        $scope.error = response.message;
        console.log($scope.error);
        // console.log('Error - can not');
      });
    };

    $scope.deleteAdmin = function(userId, index) {
      $scope.admins.splice(index, 1);
    
      $http.delete('/admin/user/' + userId).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;

        // $scope.appt = response;
        console.log('Success - Done', response);
      }).error(function(response) {
        $scope.error = response.message;
        console.log($scope.error);
        // console.log('Error - can not');
      });
    };

    $scope.deleteInstr = function(userId, index) {
      $scope.instructors.splice(index, 1);

      $http.delete('/admin/user/' + userId).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;

        // $scope.appt = response;
        console.log('Success - Done', response);
      }).error(function(response) {
        $scope.error = response.message;
        console.log($scope.error);
        // console.log('Error - can not');
      });
    };

    

    $scope.deleteCamp = function(campId, index) {
      $scope.camps.splice(index, 1);
      $http.delete('/admin/camp/' + campId).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;

        // $scope.appt = response;
        console.log('Success - Done', response);
      }).error(function(response) {
        $scope.error = response.message;
        console.log($scope.error);
      });
    };

    $scope.deleteFellow = function(userId, index) {
      $scope.fellows.splice(index, 1);
    
      $http.delete('/admin/user/' + userId).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;

        // $scope.appt = response;
        console.log('Success - Done', response);
      }).error(function(response) {
        $scope.error = response.message;
        console.log($scope.error);
      });
    };

    $scope.getSkillLevel = function(val){
      val = parseInt(val);
      if(val <= 2){
        return 'beginner';
      }
      else if(val <= 4){
        return 'junior';
      }
      else if(val <= 6){
        return 'intermediate';
      }
      else if(val <= 8){
        return 'senior';
      }
      else{
        return 'expert';
      }
    };

    $scope.listFellows = function() {
      $http.get('/admin/fellows').success(function(response) {
        // If successful show success message and clear form
        $scope.fellows = response;
      }).error(function(response) {
        $scope.error = response.message;
        console.log('Error - can not');
      });
    };

    $scope.IsFellowUnavailable = function(fellow) {
      var weeks = parseInt($scope.weeks);
      var date = moment().add(weeks, 'weeks');
      if(!fellow.placements){
        return true;
      }
      if((fellow.placements && fellow.placements.length === 0) || weeks === 0){
        return true;
      }
      else if(moment(fellow.placements[0].end_date) > date){
        return false;
      }
      else{
        return true;
      }
    };

    $scope.get_availability_date = function(fellow){
      if((fellow.placements && fellow.placements.length > 0)){
        if(moment(fellow.placements[0].end_date) > moment()){
          return moment(fellow.placements[0].end_date).format("LL");
        }
        else{
          return "Now";
        }
      }
      else{
        return "Now";
      }
    };

    $scope.get_fellow_work_days = function(fellow) {
      var oneday = 24*3600*1000;
      if ((fellow.placements && fellow.placements.length > 0)) {
        var curr_date = new Date();
        var fellowavailabilityweeks = Math.ceil(new Date(fellow.placements[0].end_date).getTime() - curr_date.getTime())/(oneday *7);
        console.log(Math.ceil(fellowavailabilityweeks));
        if (fellowavailabilityweeks <= 0) {
          return 0;
        } else {
          return Math.ceil(fellowavailabilityweeks);
        }
      }
      else{
        return 0;
      }
    }
    $scope.check_placement = function(placement, index){
        if ($scope.get_fellow_work_days(placement) <= 0) {
          $scope.fellows[index].available = 'Needs Work';
          $scope.fellows[index].week = $scope.get_fellow_work_days(placement) ;
          console.log( $scope.fellows[index].week);
        }
        else{
            $scope.fellows[index].available = 'Currently Placed';
            console.log(' placed');
            $scope.fellows[index].week = $scope.get_fellow_work_days(placement);
        }

    };

    $scope.listInstructors = function() {
      $http.get('/admin/instructors').success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
        console.log('Success - Done', response);
        
      }).error(function(response) {
        $scope.error = response.message;
        console.log('Error - can not');
      });
    };

    $scope.listAdmins = function() {
      $http.get('/admin/admins').success(function(response) {
        // If successful show success message and clear form
        $scope.admins = response;
        $scope.success = true;
        console.log('Success - Done', response);
        
      }).error(function(response) {
        $scope.error = response.message;
        console.log('Error - can not');
      });
    };

    $scope.listInstructors = function() {
      $http.get('/admin/instructors').success(function(response) {
        // If successful show success message and clear form
        $scope.instructors = response;
        $scope.success = true;
        console.log('Success - Done', response);
        
      }).error(function(response) {
        $scope.error = response.message;
        console.log('Error - can not');
      });
    };

    $scope.changeStatus = function() {
      console.log('Data Init');
      console.log($scope.data);
      $http.put('/admin/appt/' + $stateParams.apptId, $scope.data).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
        console.log('response: ' + response.status.name);
        // $location.path('admin/appt/' + response._id);
        console.log('Success - Done', response);
        $location.path('/admin/camps/' + $stateParams.bootcampId);

      }).error(function(response) {
        $scope.error = response.message;
        console.log('Error - can not');
      });
    }; 

    $scope.changeRoleToFellow = function(trainee_id, index) {
      $scope.trainees.splice(index, 1);
      $http.put('/admin/appt/' + trainee_id + '/role', {role: $scope.role[index]}).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
      }).error(function(response) {
        $scope.error = response.message;
        console.log('Error - can not');
      });
    };

    $scope.changeApplicantStatusInline = function(apptId, index){

      if($scope.data.status.name === 'fellow'){
        $http.put('/admin/appt/' + apptId + '/role', {role: 'fellow'}).success(function(response) {
          // If successful show success message and clear form
          $scope.success = true;
          $scope.camp.applicants[index].status.name = "Andela Fellow";
        }).error(function(response) {
          $scope.error = response.message;
          console.log('Error - can not');
        });
      }
      else{
        $http.put('/admin/appt/' + apptId, $scope.data).success(function(response) {
  
          // If successful show success message and clear form
          $scope.success = true;
          $scope.camp.applicants[index].status.name = $scope.data.status.name;
          $scope.camp.applicants[index].status.reason = $scope.data.status.reason;
          $scope.data.status.name = '';

        }).error(function(response) {
          $scope.error = response.message;
          console.log('Error - can not');
        });
      }

    } 

    $scope.viewInstructor = function(instrId) {
      $http.get('/admin/appt/' + instrId).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
        console.log('Success - Done', response);
        
      }).error(function(response) {
        $scope.error = response.message;
        console.log('Error - can not');
      });
    };


    $scope.rateFellow = function(traineeId, skillId, newRating) {
      var url = '/admin/trainee/' + traineeId + '/skills/' + skillId;
      $http.put(url, {rating: newRating}).success(function(response) {
        $scope.success = true;
        $scope.appt = response;
        console.log('Success - Done', response);
        
      }).error(function(response) {
        $scope.error = response.message;
        console.log('Error - can not');
      });
    };

    $scope.addPlacement = function() {
      console.log($stateParams.apptId);
      $http.post('/admin/fellow/' + $stateParams.apptId + '/placements', $scope.data).success(function(response) {
        
        // If successful show success message and clear form
        $scope.data.company = '';
        $scope.data.jobDescription ='' ;
        $scope.data.start_date = '';
        $scope.data.end_date = '';

        $scope.appt = response;
        console.log('Success - Done', response);
      }).error(function(response) {
        $scope.error = response.message;
        if ($scope.error.type === 'date'){
          $scope.error = "Please follow the date pattern specified M/D/YY e.g (use 2/5/2014 for 5th Feb 2014)"
        }
        console.log('Error - can not');
      });
    };

    /*SKILLS*/
    $scope.listSkills = function() {
      $http.get('/admin/skills').success(function(response) {
        $scope.skills = response;

      }).error(function(response) {
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

    $scope.getSkillCategories = function(){
        $http.get('/admin/skillCategories').success(function(response) {
            $scope.skillCategories = response;

        }).error(function(response) {
            $scope.error = response.message;
            $location.path('/admin/welcome');

        });
    };

    /*DELETE CATEGORY*/
    $scope.deleteSkillCategory = function(catId, index) {
      console.log('message: ' + $scope.skills);
      $scope.skills.splice(index, 1);
      console.log('after delete: ' + $scope.skills);
      $http.delete('/admin/skillCategories/' + catId).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;

        // $scope.appt = response;
        console.log('Success - Done', response);
        
      }).error(function(response) {
        $scope.error = response.message;
        console.log($scope.error);
      });
    };

  }

]);
