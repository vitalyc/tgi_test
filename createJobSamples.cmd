curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-01\", \"process\": \"dummy-job\", \"arguments\": [\"2\", \"17\"]}"
curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-02\", \"process\": \"dummy-job\", \"arguments\": [\"4\", \"343\", \"42\"]}"
curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-03\", \"process\": \"dummy-job\", \"arguments\": [\"6\", \"7\"]}"
curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-04\", \"process\": \"dummy-job\", \"arguments\": [\"22\", \"7\", \"7\", \"7\"]}"
curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-05\", \"process\": \"dummy-job\", \"arguments\": [\"12\", \"6a\"]}"
curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-06\", \"process\": \"dummy-job\", \"arguments\": [\"13\", \"99\"]}"
curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-07\", \"process\": \"dummy-job\", \"arguments\": [\"56\"], \"retryCountMax\":5}"
curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-08\", \"process\": \"dummy-job\", \"arguments\": [\"1a\", \"17\"]}"
curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-09\", \"process\": \"dummy-job\", \"arguments\": [\"test\", \"7777\"]}"
curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-10\", \"process\": \"dummy-job\", \"arguments\": [\"-34\", \"42\"]}"


curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-80\", \"process\": \"notepad\", \"arguments\": []}"
curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-81\", \"process\": \"notepad\", \"arguments\": [\"/A\", \"timeout-10sec\"], \"timeoutMs\":10000}"
curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-81\", \"process\": \"notepad\", \"arguments\": [\"/A\", \"timeout-and-retry\"], \"timeoutMs\":5000, \"retryCountMax\":5}"

curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-90\", \"process\": \"calc\", \"arguments\": []}"
curl -L "http://localhost:3000/jobs" -H "Content-Type: application/json" --data "{\"jobName\": \"my-task-90\", \"process\": \"calc\", \"arguments\": [\"test.txt\"]}"
