# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
 set :output, "#{path}/log/cron.log"
 set :environment, 'development'
 job_type :runner, "cd :path && rails runner -e :environment :task :output"
 set :job_template, "/bin/bash -i -l -c ':job'"

#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

every 1.day, :at => '12pm' do
  runner "Property.verifica_vencimento"
end

every 2.weeks, :at => '11pm' do
  runner 'Announce.exclui_anuncios'
end

