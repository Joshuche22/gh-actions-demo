output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.app.name
}

output "task_definition_arn" {
  description = "ARN of the ECS task definition"
  value       = aws_ecs_task_definition.app.arn
}

output "security_group_id" {
  description = "ID of the ECS service security group"
  value       = aws_security_group.app.id
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group name for the ECS service"
  value       = aws_cloudwatch_log_group.app.name
}