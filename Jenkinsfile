pipeline {
  agent any
  stages {
    stage('Clone e2e framework') {
      steps {
        git(url: 'https://github.com/Jans888/cypress-e2e.git', branch: 'main')
        echo 'e2e project is cloned'
      }
    }

    stage('Install cypress') {
      steps {
        sh 'npm install cypress'
        echo 'Cypress is installed'
      }
    }

  }
}