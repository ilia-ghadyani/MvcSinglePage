using Microsoft.EntityFrameworkCore;
using MvcSinglePage.ApplicationServices.Dtos.PersonDtos;
using MvcSinglePage.Models.DomainModels.PersonAggregates;
using MvcSinglePage.Models.Services.Contracts;

namespace MvcSinglePage.Models.Services.Repositories
{
    public class PersonRepository : IPersonRepository
    {
        private readonly ProjectDbContext _projectDbContext;

        #region [- Ctor() -]
        public PersonRepository(ProjectDbContext projectDbContext)
        {
            _projectDbContext = projectDbContext;
        }
        #endregion

        #region [- Insert() -]
        public async Task Insert(Person person)
        {
            if (person is null)
            {
                throw new ArgumentNullException(nameof(person));
            }
            try
            {
                _projectDbContext.Person.Add(person);
                await _projectDbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
        #endregion

        #region [- Update() -]
        public async Task Update(Person person)
        {
            if (person is null)
            {
                throw new ArgumentNullException(nameof(person));
            }
            try
            {
                await _projectDbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
        #endregion

        #region [- GetPersonById() -]
        public async Task<Person> GetPersonById(GetPersonByIdDto getPersonByIdDto)
        {
            if (getPersonByIdDto is null)
            {
                throw new ArgumentNullException(nameof(getPersonByIdDto));
            }
            try
            {
                var person = await _projectDbContext.Person.FindAsync(getPersonByIdDto.Id);

                if (person is null)
                {
                    throw new KeyNotFoundException("Person was not found.");
                }
                return person;
            }
            catch (Exception)
            {

                throw;
            }

        }
        #endregion

        #region [- Delete() -]
        public async Task Delete(Person person)
        {
            if (person is null)
            {
                throw new ArgumentNullException(nameof(person));
            }
            try
            {
                _projectDbContext.Remove(person);
                await _projectDbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
        #endregion

        #region [- SelectAll() -]
        public async Task<List<Person>> SelectAll()
        {
            try
            {
                return await _projectDbContext.Person.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        } 
        #endregion
    }
}
