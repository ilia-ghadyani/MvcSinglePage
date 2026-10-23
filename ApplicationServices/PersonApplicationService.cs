using MvcSinglePage.ApplicationServices.Contracts;
using MvcSinglePage.ApplicationServices.Dtos.PersonDtos;
using MvcSinglePage.Models.DomainModels.PersonAggregates;
using MvcSinglePage.Models.Services.Contracts;

namespace MvcSinglePage.ApplicationServices
{
    public class PersonApplicationService : IPersonApplicationService
    {
        private readonly IPersonRepository _personRepository;

        #region [- Ctor() -]
        public PersonApplicationService(IPersonRepository personRepository)
        {
            _personRepository = personRepository;
        }
        #endregion

        #region [- Post() -]
        public async Task Post(PostPersonDto postPersonDto)
        {
            if (postPersonDto is null)
            {
                throw new ArgumentNullException(nameof(postPersonDto));
            }
            var person = new Person
            {
                FirstName = postPersonDto.FirstName,
                LastName = postPersonDto.LastName,

            };
            await _personRepository.Insert(person);
        }
        #endregion

        #region [- Put() -]
        public async Task Put(PutPersonDto putPersonDto)
        {
            if (putPersonDto is null)
            {
                throw new ArgumentNullException(nameof(putPersonDto));
            }
            var getPersonByIdDto = new GetPersonByIdDto()
            {
                Id = putPersonDto.Id,
            };
            var person = await _personRepository.GetPersonById(getPersonByIdDto);

            person.FirstName = putPersonDto.FirstName;
            person.LastName = putPersonDto.LastName;

            await _personRepository.Update(person);
        }
        #endregion

        #region [- Delete() -]
        public async Task Delete(DeletePersonDto deletePersonDto)
        {
            if (deletePersonDto is null)
            {
                throw new ArgumentNullException(nameof(deletePersonDto));
            }
            var Person = new Person()
            {
                Id = deletePersonDto.Id,
            };
            await _personRepository.Delete(Person);
        }
        #endregion

        #region [- GetAllPerson() -]
        public async Task<List<GetPersonDto>> GetAllPerson()
        {
            var persons = await _personRepository.SelectAll();
            var getPersonDtos = new List<GetPersonDto>();
            foreach (var item in persons)
            {
                var getPersonDto = new GetPersonDto()
                {
                    Id = item.Id,
                    FirstName = item.FirstName,
                    LastName = item.LastName,
                };
                getPersonDtos.Add(getPersonDto);
            }
            return getPersonDtos;
        } 
        #endregion
    }
}
